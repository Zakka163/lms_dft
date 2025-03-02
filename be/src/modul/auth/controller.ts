import { google } from "googleapis";
import { Request, Response } from 'express';
import User from '../user/model.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
console.log(`${process.env.URL_FRONTEND}/auth/google/callback`);


const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.SESSION_SECRET,
   "http://localhost:5000/auth/google/callback" 
);

const scopes = [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile'
];

const googleAuthUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt:"select_account"
});

interface Payload {
    user_id: string;
    nama: string;
    role: string;
}

export const controllerLoginGoogle = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log("🚀 ~ controllerLoginGoogle ~ googleAuthUrl:", googleAuthUrl)
        res.redirect(googleAuthUrl);
    } catch (error) {
        res.status(500).json({ message: "Error during Google authentication", error });
    }
};

export const controllerCallbackAuthGoogle = async (req: Request, res: Response): Promise<any> => {
    try {
        const { code } = req.query;

        if (!code || typeof code !== 'string') {
            return res.status(400).json({ message: "Authorization code is missing or invalid" });
        }

        const { tokens } = await oauth2Client.getToken(code);
        oauth2Client.setCredentials(tokens);
        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: "v2"
        });

        const { data } = await oauth2.userinfo.get();

        if (!data) {
            return res.status(404).json({ message: "No user data found" });
        }
        const existingUser = await User.findOne({ where: { email: data.email } });

        let payload: Payload = { user_id: "", nama: "", role: "" };

        if (!existingUser) {
            const newUser = await User.create({
                email: data.email,
                nama: data.name,
                role: "siswa",
                password: "-"
            });

            payload.user_id = newUser.dataValues.user_id;
            payload.nama = newUser.dataValues.nama;
            payload.role = newUser.dataValues.role;
        } else {
            payload.user_id = existingUser.dataValues.user_id;
            payload.nama = existingUser.dataValues.nama;
            payload.role = existingUser.dataValues.role;
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.redirect(`${process.env.URL_FRONTEND}/auth-success?token=${token}`);
        // res.json({ token, role: payload.role });
    } catch (error) {
        console.error("Error during Google callback", error);
        res.status(500).json({ message: "Error during Google callback", error });
    }
};

export const controllerlogin = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body
        const existingUser = await User.findOne({ where: { email: email } });
        if (!existingUser) {
            return res.status(404).json({ message: "No user data found" });
        }
        console.log("🚀 ~ controllerlogin ~ existingUser:", existingUser)
        const isMatch = await bcrypt.compare(password, existingUser.dataValues.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Username atau password salah' });
        }
        const token = jwt.sign({ user_id: existingUser.dataValues.user_id, nama: existingUser.dataValues.nama, role: existingUser.dataValues.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
        res.json({ token, role: existingUser.dataValues.role });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "Error during login", error });
    }
};
