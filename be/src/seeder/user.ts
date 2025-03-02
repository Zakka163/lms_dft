import bcrypt from "bcrypt"
import UserModel from "../modul/user/model.js";
import UserService from "../modul/user/service.js";

export async function seedData() {
    try {
        const salt = await bcrypt.genSalt(10);
        const passwrodhash = await bcrypt.hash("123", salt);
        await UserService.createUser({
            user_id: 1,
            nama: "admin",
            password: passwrodhash,
            email: "admin@gmail.com",
            kelamin: "L",
            nomor_telpon: "0861673",
            role: "admin",
            poin: 0
        })
        await UserService.createUser({
            user_id: 2,
            nama: "siswa",
            password: passwrodhash,
            email: "siswa@gmail.com",
            kelamin: "L",
            nomor_telpon: "0861673",
            role: "siswa",
            poin: 0
        })
    } catch (error) {
        console.log(error);

    }
}
