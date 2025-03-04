import { google } from "googleapis";
import { Request, Response } from 'express';
import User from '../user/model.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import Gambar from "../gambar/model.js";
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
    prompt: "select_account"
});

interface Payload {
    user_id: string;
    nama: string;
    role: string;
    picture: string;
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

        console.log("🚀 ~ controllerCallbackAuthGoogle ~ data:", data)
        if (!data) {
            return res.status(404).json({ message: "No user data found" });
        }
        const existingUser = await User.findOne({
            where: { email: data.email },
            include: [
                {
                    model: Gambar,
                    required: false,
                },
            ],
        });
        console.log("🚀 ~ controllerCallbackAuthGoogle ~ existingUser:", existingUser?.dataValues.gambar.dataValues)


        let payload: Payload = { user_id: "", nama: "", role: "", picture: "" };

        if (!existingUser) {
            const newGambar = await Gambar.create({
                url: data.picture
            })
            const newUser = await User.create({
                email: data.email,
                nama: data.name,
                role: "siswa",
                password: "-",
                gambar_id: newGambar.dataValues.gambar_id
            });

            payload.user_id = newUser.dataValues.user_id;
            payload.nama = newUser.dataValues.nama;
            payload.role = newUser.dataValues.role;
            payload.picture = newGambar.dataValues.url ? newGambar.dataValues.url : ""
        } else {
            payload.user_id = existingUser.dataValues.user_id;
            payload.nama = existingUser.dataValues.nama;
            payload.role = existingUser.dataValues.role;
            payload.picture = existingUser?.dataValues.gambar.dataValues.url ? existingUser?.dataValues.gambar.dataValues.url : ""
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '24h' });
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
        const existingUser = await User.findOne({
            where: { email: email },
            include: [
                {
                    model: Gambar,
                    required: false,
                },
            ],
        });
        if (!existingUser) {
            return res.status(404).json({ message: "No user data found" });
        }
        console.log("🚀 ~ controllerlogin ~ existingUser:", existingUser)
        const isMatch = await bcrypt.compare(password, existingUser.dataValues.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Username atau password salah' });
        }
        const token = jwt.sign({ user_id: existingUser.dataValues.user_id, nama: existingUser.dataValues.nama, role: existingUser.dataValues.role, picture: existingUser?.dataValues.gambar ? existingUser?.dataValues.gambar.dataValues.url : "" }, process.env.JWT_SECRET!, { expiresIn: '24h' });
        res.json({ token, role: existingUser.dataValues.role });
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "Error during login", error });
    }
};
