import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET

export const authMiddleware = (req: any, res: Response, next: NextFunction): any => {
    const token = req.headers.authorization?.split(' ')[1]; // Format: "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Token tidak ditemukan, akses ditolak' });
    }

    // Verifikasi token
    jwt.verify(token, SECRET_KEY as string, (err: any, decoded: any) => {
        if (err) {
            return res.status(403).json({ message: 'Token tidak valid, akses ditolak' });
        }
        req.user = decoded;
        // console.log(req.user);
        next();
    });
};
export const authorizationMiddleware = (requiredRole: string) => {
    return (req: any, res: Response, next: NextFunction): any => {
        const user = req.user; 
        if (!user) {
            return res.status(403).json({ message: 'Tidak ada user yang terautentikasi' });
        }
        if (user.role !== requiredRole) {
            return res.status(403).json({ message: 'Akses ditolak: Tidak cukup hak akses' });
        }
        next();
    };
};