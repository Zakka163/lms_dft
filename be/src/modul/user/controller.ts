import { Request, Response } from 'express';
import UserService from './service.js'; 

export const controllerGetUsers = async (req: Request, res: Response) => {
    try {
        const filters = req.query; 
        const users = await UserService.getAllUsers(filters);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};
