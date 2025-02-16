import { Sequelize } from "sequelize";
import mysql2 from "mysql2";
import dotenv from 'dotenv'; 
dotenv.config();

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
