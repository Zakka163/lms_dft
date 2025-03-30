import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        // Ambil ekstensi file
        const ext = path.extname(file.originalname);
        
        // Bersihkan nama file agar aman
        const safeName = file.originalname
            .replace(ext, "") // Hilangkan ekstensi sementara
            .replace(/[^a-zA-Z0-9-_]/g, "_") // Ganti karakter spesial dengan "_"
            .substring(0, 100); // Batasi panjang nama file jika terlalu panjang

        // Buat nama unik
        const finalName = `${Date.now()}-${safeName}${ext}`;

        cb(null, finalName);
    },
});

export const upload = multer({ storage });

