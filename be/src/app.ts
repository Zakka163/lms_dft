import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import router from "./routes.js";
import { sq, testConnection } from "./config/connection.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = 5000;

// Tes koneksi database
testConnection();
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));
// Middleware CORS
app.use(cors({
    origin: "*",
    methods: "GET, POST, PUT, DELETE",
}));

// Buat folder uploads jika belum ada
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Middleware Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gunakan router
app.use("/", router);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
