import { sq, testConnection } from "./config/connection.js";
import UserModel from "./modul/user/model.js";
import UserService from "./modul/user/service.js";
import express, { Request, Response } from 'express';
import router from "./routes.js";
import bcrypt from "bcrypt"
import cors from "cors"
const app = express();
const PORT = 5000;
testConnection()
// async function seedData() {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const passwrodhash = await bcrypt.hash("123", salt);
//         await UserService.createUser({
//             user_id: 1,
//             nama: "admin",
//             password: passwrodhash,
//             email: "m@gmail.com",
//             kelamin: "L",
//             nomor_telpon: "0861673",
//             role: "siswa",
//             poin: 0
//         })
//     } catch (error) {
//         console.log(error);

//     }
// }

// seedData()
app.use(cors({
    origin: "*", // Mengizinkan semua origin
    methods: "GET, POST, PUT, DELETE", // Mengizinkan semua metode HTTP
    allowedHeaders: "Content-Type, Authorization", // Mengizinkan header tertentu
  }));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use('/', router)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});