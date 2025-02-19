import { Request, Response } from "express";
import sub_kategori from "./model.js";

class subKategoriController {
    static async list(req: Request, res: Response): Promise<any> {
        try {
            const sub_categories = await sub_kategori.findAll();
            res.status(200).json({ success: true, data: sub_categories });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error?.message || "Terjadi kesalahan" });
        }
    }
    static async add(req: Request, res: Response): Promise<any> {
        try {
            const { nama_sub_kategori, kategori_id } = req.body;
            if (!kategori_id) {
                return res.status(400).json({ success: false, message: "kategori id wajib diisi" });
            }
            if (!nama_sub_kategori) {
                return res.status(400).json({ success: false, message: "Nama kategori wajib diisi" });
            }

            const new_sub_kategori = await sub_kategori.create({ nama_sub_kategori, kategori_id });
            res.status(201).json({ success: true, data: new_sub_kategori });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error?.message || "Terjadi kesalahan" });
        }
    }
    static async edit(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { nama_sub_kategori } = req.body;

            const existing_sub_kategori = await sub_kategori.findByPk(id);
            if (!existing_sub_kategori) {
                return res.status(404).json({ success: false, message: "Kategori tidak ditemukan" });
            }

            await existing_sub_kategori.update({ nama_sub_kategori });
            res.status(200).json({ success: true, data: existing_sub_kategori });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error?.message || "Terjadi kesalahan" });
        }
    }
    static async delete(req: Request, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const existing_sub_kategori = await sub_kategori.findByPk(id);
            if (!existing_sub_kategori) {
                return res.status(404).json({ success: false, message: "Kategori tidak ditemukan" });
            }

            await sub_kategori.destroy({ where: { id } });
            res.status(200).json({ success: true  });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error?.message || "Terjadi kesalahan" });
        }
    }
}

export default subKategoriController;
