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
            const { nama_kelas, kategori, status_kelas, min_harga, max_harga, search, page, limit } = req.query;
            let whereClause = ` WHERE k.deletedAt IS NULL`;
            if (search) {
                whereClause += ` AND k.nama_kelas LIKE :search `;
            }
            if (nama_kelas) {
                whereClause += ` AND k.nama_kelas LIKE :nama_kelas `;
            }
            if (status_kelas) {
                whereClause += ` AND k.status_kelas = :status_kelas `;
            }
            if (min_harga) {
                whereClause += ` AND k.harga_diskon_kelas >= :min_harga `;
            }
            if (max_harga) {
                whereClause += ` AND k.harga_diskon_kelas <= :max_harga `;
            }
            if (kategori) {
                whereClause += ` AND sk.nama_sub_kategori = :kategori `;
            }
            const pageNumber = Number(page) || 1;
            const limitNumber = Number(limit) || 10;
            const offset = (pageNumber - 1) * limitNumber;
            let data = await sq.query(
                `SELECT 
                    k.kelas_id, 
                    k.nama_kelas, 
                    COALESCE(
                        JSON_ARRAYAGG(
                            DISTINCT JSON_OBJECT(
                                'id', sk.sub_kategori_id,
                                'nama', sk.nama_sub_kategori
                            )
                        ), 
                        JSON_ARRAY()
                    ) AS kategori,
                    k.harga_diskon_kelas AS harga,
                    k.status_kelas 
                FROM kelas k
                LEFT JOIN kategori_kelas kk ON kk.kelas_id = k.kelas_id and kk.deletedAt is null
                LEFT JOIN sub_kategori sk ON sk.sub_kategori_id = kk.sub_kategori_id
                ${whereClause}
                GROUP BY k.kelas_id 
                ORDER BY k.createdAt DESC
                LIMIT :limit OFFSET :offset;`,
                {
                    replacements: {
                        nama_kelas: `%${nama_kelas}%`,
                        search: `%${nama_kelas}%`,
                        kategori,
                        status_kelas,
                        min_harga,
                        max_harga,
                        limit: limitNumber,
                        offset,
                    },
                    type: QueryTypes.SELECT,
                }
            );

            data = data.map((item: any) => ({
                ...item,
                kategori: JSON.parse(item.kategori),
            }));
            const totalDataResult = await sq.query(
                `SELECT COUNT(DISTINCT k.kelas_id) as total FROM kelas k
                LEFT JOIN kategori_kelas kk ON kk.kelas_id = k.kelas_id
                LEFT JOIN sub_kategori sk ON sk.sub_kategori_id = kk.sub_kategori_id
                ${whereClause}`,
                {
                    replacements: {
                        nama_kelas: `%${nama_kelas}%`,
                        search: `%${nama_kelas}%`,
                        kategori,
                        status_kelas,
                        min_harga,
                        max_harga,
                    },
                    type: QueryTypes.SELECT,
                }
            );

            const totalData = (totalDataResult as { total: number }[])[0]?.total || 0;

            const totalPages = Math.ceil(totalData / limitNumber);

            res.status(200).json({
                success: true,
                data,
                pagination: {
                    currentPage: pageNumber,
                    totalPages,
                    totalData,
                    limit: limitNumber,
                },
            });
        } catch (error: any) {
            res.status(500).json({ success: false, message: error?.message || "Terjadi kesalahan" });
        }
    }

    static async add(req: Request, res: Response): Promise<any> {

        const transaction = await sq.transaction();
        try {
            let parsedKategori = [];
            const {
                nama_kelas,
                deskripsi_kelas,
                poin_reward,
                harga_kelas,
                harga_diskon_kelas,
                pembelajaran_kelas,
                status_kelas,
                pengajar,
                kategori, // Ambil dalam bentuk string terlebih dahulu
                materi
            } = req.body; const background_kelas = req.file ? `${req.file.filename}` : null;
            parsedKategori = kategori ? JSON.parse(kategori) : [];
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
            console.log("🚀 ~ KelasController ~ add ~ kelasBaru:", parsedKategori)
            if (Array.isArray(parsedKategori) && parsedKategori.length > 0) {
                const kategoriKelasData = parsedKategori.map((data: any) => ({
                    kelas_id: kelasBaru.kelas_id,
                    sub_kategori_id: data.sub_kategori_id,
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
            const query = `SELECT 
                    k.kelas_id, 
                    k.nama_kelas, 
                    k.deskripsi_kelas,
                    k.poin_reward,
                    k.harga_kelas,
                    k.harga_diskon_kelas,
                    k.pembelajaran_kelas,
                    k.status_kelas,
                    k.pengajar,
                    k.background_kelas,
                    COALESCE(
                        (SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'sub_kategori_id', sk.sub_kategori_id,
                                'nama_kategori', kt.nama_kategori,
                                'kategori_id', kt.kategori_id,
                                'nama_sub_kategori', sk.nama_sub_kategori
                            )
                        ) 
                        FROM kategori_kelas kk
                        JOIN sub_kategori sk ON sk.sub_kategori_id = kk.sub_kategori_id AND sk.deletedAt IS NULL
                        JOIN kategori kt ON kt.kategori_id = sk.kategori_id AND kt.deletedAt IS NULL
                        WHERE kk.kelas_id = k.kelas_id and  kk.deletedAt is null
                        ), JSON_ARRAY()
                    ) AS kategori,
                    COALESCE(
                        (SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'materi_id', m.materi_id,
                                'nama_materi', m.nama_materi,
                                'urutan', m.urutan,
                                'sub_materi', COALESCE(
                                    (SELECT JSON_ARRAYAGG(
                                        JSON_OBJECT(
                                            'sub_materi_id', sm.sub_materi_id,
                                            'nama_sub_materi', sm.nama_sub_materi,
                                            'urutan', sm.urutan,
                                            'link', sm.link
                                        )
                                    ) FROM sub_materi sm 
                                    WHERE sm.materi_id = m.materi_id AND sm.deletedAt IS NULL), JSON_ARRAY()
                                )
                            )
                        ) 
                        FROM materi m 
                        WHERE m.kelas_id = k.kelas_id AND m.deletedAt IS NULL
                        ), JSON_ARRAY()
                    ) AS materi
                FROM kelas k
                WHERE k.deletedAt IS NULL and k.kelas_id = :kelasId
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
        const { id } = req.params;
        const transaction = await sq.transaction();
        try {
            let parsedKategori = [];
            const {
                nama_kelas,
                deskripsi_kelas,
                poin_reward,
                harga_kelas,
                harga_diskon_kelas,
                pembelajaran_kelas,
                status_kelas,
                pengajar,
                kategori, // String, perlu di-parse
                materi
            } = req.body;
            
            const background_kelas = req.file ? `${req.file.filename}` : null;
            parsedKategori = kategori ? JSON.parse(kategori) : [];
            console.log("🚀 ~ KelasController ~ update ~ parsedKategori:", parsedKategori)
            console.log("🚀 ~ KelasController ~ update ~ parsedKategori:", parsedKategori)
            
            const kelas = await kelas_m.findByPk(id);
            if (!kelas) {
                await transaction.rollback();
                return res.status(404).json({ success: false, message: "Kelas tidak ditemukan" });
            }
            
            await kelas.update({
                nama_kelas,
                deskripsi_kelas,
                poin_reward,
                background_kelas: background_kelas || kelas.background_kelas,
                harga_kelas,
                harga_diskon_kelas,
                pembelajaran_kelas,
                status_kelas,
                pengajar,
            }, { transaction });
            
            // Update kategori jika ada perubahan
            if (Array.isArray(parsedKategori)) {
                await kelas_kategori_m.destroy({ where: { kelas_id: id },force: true, transaction });
                if (parsedKategori.length > 0) {
                    const kategoriKelasData = parsedKategori.map((data: any) => ({
                        kelas_id: id,
                        sub_kategori_id: data.sub_kategori_id,
                    }));
                    await kelas_kategori_m.bulkCreate(kategoriKelasData, { transaction });
                }
            }
            
            // Update materi dan sub-materi
            if (Array.isArray(materi)) {
                await materi_m.destroy({ where: { kelas_id: id }, transaction });
                const materiBaru = await materi_m.bulkCreate(
                    materi.map((materiItem) => ({
                        nama_materi: materiItem.nama_materi,
                        urutan: materiItem.urutan,
                        kelas_id: id,
                    })),
                    { transaction, returning: true }
                );
                
                let subMateriData: any[] = [];
                materi.forEach((materiItem, index) => {
                    if (Array.isArray(materiItem.sub_materi)) {
                        materiItem.sub_materi.forEach((subItem: any) => {
                            subMateriData.push({
                                link: subItem.link,
                                nama_sub_materi: subItem.nama_sub_materi,
                                urutan: subItem.urutan,
                                materi_id: materiBaru[index].materi_id,
                            });
                        });
                    }
                });
                if (subMateriData.length > 0) {
                    await sub_materi_m.bulkCreate(subMateriData, { transaction });
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
