import { Sequelize } from "sequelize";
import mysql2 from "mysql2";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

// Dapatkan __dirname dalam ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load file .env dari root proyek
dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});
// console.log("Current working directory:", process.cwd());

// console.log("Current file path:", __filename);
// console.log("Current directory path:", __dirname);
// console.log("🚀 ~ process.env.DATABASE_NAME:", process.env.DATABASE_NAME)

const sq = new Sequelize(process.env.DATABASE_NAME as string, process.env.USERNAME as string , process.env.PASSWORD, {
  host: "localhost",
  dialect: "mysql",
  dialectModule: mysql2, 
  logging: false, 
});


const testConnection = async () => {
  try {
    await sq.authenticate();
    console.log("✅ Koneksi ke MySQL berhasil!");
  } catch (error) {
    console.error("❌ Gagal konek ke MySQL:", error);
  }
};



export { sq,testConnection };
