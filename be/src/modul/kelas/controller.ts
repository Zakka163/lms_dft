import { Request, Response } from "express";
import kelas_m from "./model.js";
import { sq } from "../../config/connection.js";
import QueryTypes from "sequelize/lib/query-types";
import kelas_kategori_m from "../kategori_kelas/model.js"
import materi_m from "../materi/model.js"
import sub_materi_m from "../sub_materi/model.js"

interface ResponseKelas {
    kelas_id: number;
    nama_kelas: string;
    deskripsi_kelas: string;
    poin_reward: number;
    harga_kelas: number;
    harga_diskon_kelas: number;
    pembelajaran_kelas: string;
    status_kelas: string;
    pengajar: string;
    kategori: string;
    materi: string;
}

class KelasController {
    static async list(req: Request, res: Response): Promise<any> {
        try {
            const { nama_kelas, kategori, status_kelas, min_harga, max_harga } = req.query;

            let whereClause = `WHERE k.deletedAt IS NULL`;

            if (nama_kelas) {
                whereClause += ` AND k.nama_kelas LIKE :nama_kelas`;
            }
            if (status_kelas) {
                whereClause += ` AND k.status_kelas = :status_kelas`;
            }
            if (min_harga) {
                whereClause += ` AND k.harga_diskon_kelas >= :min_harga`;
            }
            if (max_harga) {
                whereClause += ` AND k.harga_diskon_kelas <= :max_harga`;
            }
            if (kategori) {
                whereClause += ` AND sk.nama_sub_kategori = :kategori`;
            }

            let data = await sq.query(
                `SELECT 
                    k.kelas_id, 
                    k.nama_kelas, 
                    COALESCE(
                        JSON_ARRAYAGG(DISTINCT sk.nama_sub_kategori), 
                        JSON_ARRAY()
                    ) AS kategori,
                    k.harga_diskon_kelas as harga,
                    k.status_kelas 
                FROM kelas k
                LEFT JOIN kategori_kelas kk ON kk.kelas_id = k.kelas_id
                LEFT JOIN sub_kategori sk ON sk.sub_kategori_id = kk.sub_kategori_id
                ${whereClause}
                GROUP BY k.kelas_id 
                ORDER BY k.createdAt DESC`,
                {
                    replacements: {
                        nama_kelas: `%${nama_kelas}%`,
                        kategori,
                        status_kelas,
                        min_harga,
                        max_harga,
                    },
                    type: QueryTypes.SELECT,
                }
            );
            data = data.map((item: any) => ({
                ...item,
                kategori: JSON.parse(item.kategori),
            }));
            res.status(200).json({ success: true, data });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error?.message || "Terjadi kesalahan" });
        }
    }
    static async add(req: Request, res: Response): Promise<any> {
        const transaction = await sq.transaction();
        try {
            const { nama_kelas, deskripsi_kelas, poin_reward, background_kelas, harga_kelas, harga_diskon_kelas, pembelajaran_kelas, status_kelas, pengajar, kategori, materi } = req.body;

            const kelasBaru = await kelas_m.create(
                {
                    nama_kelas,
                    deskripsi_kelas,
                    poin_reward,
                    background_kelas,
                    harga_kelas,
                    harga_diskon_kelas,
                    pembelajaran_kelas,
                    status_kelas,
                    pengajar,
                },
                { transaction }
            );
            if (Array.isArray(kategori) && kategori.length > 0) {
                const kategoriKelasData = kategori.map((sub_kategori_id: number) => ({
                    kelas_id: kelasBaru.kelas_id,
                    sub_kategori_id,
                }));
                await kelas_kategori_m.bulkCreate(kategoriKelasData, { transaction });
            }
            if (Array.isArray(materi) && materi.length > 0) {
                const materiData = materi.map((materiItem) => ({
                    nama_materi: materiItem.nama_materi,
                    urutan: materiItem.urutan,
                    kelas_id: kelasBaru.kelas_id,
                }));
                const materiBaru = await materi_m.bulkCreate(materiData, { transaction, returning: true });
                let subMateriData: any[] = [];
                materi.forEach((materiItem, index) => {
                    if (Array.isArray(materiItem.sub_materi) && materiItem.sub_materi.length > 0) {
                        materiItem.sub_materi.forEach((subItem: any) => {
                            subMateriData.push({
                                link: subItem.link,
                                nama_sub_materi: subItem.nama_sub_materi,
                                urutan: subItem.urutan,
                                materi_id: materiBaru[index].materi_id as number,
                            });
                        });
                    }
                });
                if (subMateriData.length > 0) {
                    await sub_materi_m.bulkCreate(subMateriData, { transaction });
                }
            }

            await transaction.commit();
            res.status(201).json({
                success: true,
                message: "Kelas berhasil ditambahkan",
                data: kelasBaru,
            });
        } catch (error: any) {
            console.log("🚀 ~ KelasController ~ add ~ error:", error)
            await transaction.rollback();
            res.status(500).json({
                success: false,
                message: error?.message || "Terjadi kesalahan",
            });
        }
    }
    static async getById(req: Request, res: Response): Promise<any> {
        try {
            const query = `
                SELECT 
                    k.kelas_id, 
                    k.nama_kelas, 
                    k.deskripsi_kelas,
                    k.poin_reward,
                    k.harga_kelas,
                    k.harga_diskon_kelas,
                    k.pembelajaran_kelas,
                    k.status_kelas,
                    k.pengajar,
                    COALESCE(JSON_ARRAYAGG(DISTINCT JSON_OBJECT(
                        'sub_kategori_id', sk.sub_kategori_id,
                        'nama_kategori', sk.nama_sub_kategori
                    )), JSON_ARRAY()) AS kategori,
                    COALESCE(JSON_ARRAYAGG(DISTINCT JSON_OBJECT(
                        'materi_id', m.materi_id,
                        'nama_materi', m.nama_materi,
                        'urutan', m.urutan,
                        'sub_materi', (
                            SELECT JSON_ARRAYAGG(DISTINCT JSON_OBJECT(
                                'sub_materi_id', sm.sub_materi_id,
                                'nama_sub_materi', sm.nama_sub_materi,
                                'urutan', sm.urutan,
                                'link', sm.link
                            )) FROM sub_materi sm WHERE sm.materi_id = m.materi_id
                        )
                    )), JSON_ARRAY()) AS materi
                FROM kelas k
                LEFT JOIN kategori_kelas kk ON kk.kelas_id = k.kelas_id 
                LEFT JOIN sub_kategori sk ON sk.sub_kategori_id = kk.sub_kategori_id 
                LEFT JOIN materi m ON m.kelas_id = k.kelas_id 
                LEFT JOIN sub_materi sm ON sm.materi_id = m.materi_id 
                WHERE kk.deletedAt is null and sk.deletedAt is null and m.deletedAt is null and sm.deletedAt is null and k.kelas_id = :kelasId
                GROUP BY k.kelas_id;
            `;

            const [data]: ResponseKelas[] = await sq.query(query, {
                replacements: { kelasId: req.params.id },
                type: QueryTypes.SELECT,
            });

            if (!data) {
                return res.status(404).json({ success: false, message: "Kelas tidak ditemukan" });
            }
            data.kategori = data?.kategori ? JSON.parse(data.kategori) : [];
            data.materi = data?.materi ? JSON.parse(data.materi) : [];
            res.status(200).json({ success: true, data });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
        }
    }
    static async update(req: Request, res: Response): Promise<any> {
        const transaction = await sq.transaction();
        try {
            const { id } = req.params;
            const { nama_kelas, deskripsi_kelas, poin_reward, background_kelas, harga_kelas, harga_diskon_kelas, pembelajaran_kelas, status_kelas, pengajar, kategori, materi } = req.body;

            const kelas = await kelas_m.findByPk(id, { transaction });
            if (!kelas) {
                return res.status(404).json({ success: false, message: "Kelas tidak ditemukan" });
            }

            await kelas.update(
                { nama_kelas, deskripsi_kelas, poin_reward, background_kelas, harga_kelas, harga_diskon_kelas, pembelajaran_kelas, status_kelas, pengajar },
                { transaction }
            );

            if (Array.isArray(kategori)) {
                await kelas_kategori_m.destroy({ where: { kelas_id: id }, transaction });
                if (kategori.length > 0) {
                    const kategoriKelasData = kategori.map((sub_kategori_id: number) => ({
                        kelas_id: id,
                        sub_kategori_id,
                    }));
                    await kelas_kategori_m.bulkCreate(kategoriKelasData, { transaction });
                }
            }

            if (Array.isArray(materi)) {
                await materi_m.destroy({ where: { kelas_id: id }, transaction });
                let subMateriData: any[] = [];

                if (materi.length > 0) {
                    const materiData = materi.map((materiItem) => ({
                        nama_materi: materiItem.nama_materi,
                        urutan: materiItem.urutan,
                        kelas_id: id,
                    }));
                    const materiBaru = await materi_m.bulkCreate(materiData, { transaction, returning: true });

                    materi.forEach((materiItem, index) => {
                        if (Array.isArray(materiItem.sub_materi)) {
                            materiItem.sub_materi.forEach((subItem: any) => {
                                subMateriData.push({
                                    link: subItem.link,
                                    nama_sub_materi: subItem.nama_sub_materi,
                                    urutan: subItem.urutan,
                                    materi_id: materiBaru[index].materi_id as number,
                                });
                            });
                        }
                    });
                    if (subMateriData.length > 0) {
                        await sub_materi_m.bulkCreate(subMateriData, { transaction });
                    }
                }
            }

            await transaction.commit();
            res.status(200).json({
                success: true,
                message: "Kelas berhasil diperbarui",
                data: kelas,
            });
        } catch (error: any) {
            console.log("🚀 ~ KelasController ~ update ~ error:", error);
            await transaction.rollback();
            res.status(500).json({
                success: false,
                message: error?.message || "Terjadi kesalahan",
            });
        }
    }
    static async delete(req: Request, res: Response): Promise<any> {
        const transaction = await sq.transaction(); 
        try {
            const { id } = req.params;
            const data = await materi_m.findAll({
                where: { kelas_id: id },
                attributes: ['materi_id'],
                raw: true,
                transaction,
            });
            const materiIds = data.map(m => m.materi_id);
            if (materiIds.length > 0) {
                await sub_materi_m.destroy({
                    where: { materi_id: materiIds },
                    transaction,
                });
            }
            await materi_m.destroy({ where: { kelas_id: id }, transaction });
            await kelas_kategori_m.destroy({ where: { kelas_id: id }, transaction });
            await kelas_m.destroy({ where: { kelas_id: id }, transaction });
            await transaction.commit();
            res.status(200).json({
                success: true,
                message: "Kelas berhasil dihapus",
            });
    
        } catch (error: any) {
            await transaction.rollback(); 
            res.status(500).json({
                success: false,
                message: error?.message || "Terjadi kesalahan",
            });
        }
    }
}

export default KelasController;
