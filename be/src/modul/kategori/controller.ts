import { Request, Response } from "express";
import kategori from "./model.js";

class KategoriController {
    static async list(req: Request , res: Response): Promise<any> {
        try {
            const categories = await kategori.findAll();
            res.status(200).json({ success: true, data: categories });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error?.message || "Terjadi kesalahan" });
        }
    }
    static async add(req: Request, res: Response): Promise<any> {
        try {
            const { nama_kategori } = req.body;
            if (!nama_kategori) {
                return res.status(400).json({ success: false, message: "Nama kategori wajib diisi" });
            }

            const newKategori = await kategori.create({ nama_kategori });
            res.status(201).json({ success: true, data: newKategori });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error?.message || "Terjadi kesalahan" });
        }
    }
    static async edit(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { nama_kategori } = req.body;

            const existingKategori = await kategori.findByPk(id);
            if (!existingKategori) {
                return res.status(404).json({ success: false, message: "Kategori tidak ditemukan" });
            }

            await existingKategori.update({ nama_kategori });
            res.status(200).json({ success: true, data: existingKategori });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error?.message || "Terjadi kesalahan" });
        }
    }
}

export default KategoriController;
