import {sq, testConnection} from "./config/connection.js";
import  UserModel from "./modul/user/model.js";
import UserService from "./modul/user/service.js";
import express, { Request, Response } from 'express';
import router from "./routes.js";

const app = express();
const PORT = 3000;


app.use(express.json());
app.use('/',router)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});