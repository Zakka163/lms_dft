import bcrypt from "bcrypt";
import UserService from "../modul/user/service.js";

export async function seedData() {
    try {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash("123", salt);

        const users = [
            {
                user_id: 1,
                nama: "admin",
                email: "admin@gmail.com",
                kelamin: "L" as "L", 
                nomor_telpon: "0861673",
                role: "admin" as "admin",
                poin: 0,
            },
            {
                user_id: 2,
                nama: "siswa",
                email: "siswa@gmail.com",
                kelamin: "L" as "L",
                nomor_telpon: "0861673",
                role: "siswa" as "siswa", 
                poin: 0,
            }
        ];



        const isValidKelamin = (kelamin: string): kelamin is "L" | "P" => ["L", "P"].includes(kelamin);

        for (const user of users) {
            if (!isValidKelamin(user.kelamin)) {
                console.error(`Invalid gender value for ${user.email}: ${user.kelamin}`);
                continue; 
            }
            const existingUser = await UserService.getUserByEmail(user.email);
            if (!existingUser) {
                await UserService.createUser({ ...user, password: passwordHash });
                console.log("User inserted successfully");
            }{
                console.log("User already exist, no data inserted");
            }
        }

    } catch (error) {
        console.error("Error seeding data:", error);
    }
}
