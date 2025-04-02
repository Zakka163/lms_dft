import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import { sq } from '../../config/connection.js';
import PembayaranKelas from '../pembayaran_kelas/model.js';
import KelasSiswa from '../kelas_siswa/model.js';
import { extractOrderId, statusTransaction } from '../../helper.ts/midtrans.js';
import crypto from "crypto";
import PembayaranPoin from '../pembayaran_poin/model.js';
import User from '../user/model.js';
import Poin from '../poin/model.js';

type PembayaranType = PembayaranPoin | PembayaranKelas | null;

export const getTransaksi = async (req: Request, res: Response): Promise<any> => {
    try {
        const { type, search, status_pembayaran, start_date, end_date, page, limit } = req.query;
        let whereClausePK = ` WHERE pk.deletedAt IS NULL `;
        let whereClausePP = ` WHERE pp.deletedAt IS NULL `;
        let whereClause = ` `;
        if (search) {
            whereClausePK += ` AND u1.nama LIKE :search `;
            whereClausePP += ` AND u2.nama LIKE :search `;
        }
        if (status_pembayaran) {
            whereClausePK += ` AND pk.status_pembayaran = :status_pembayaran `;
            whereClausePP += ` AND pp.status_pembayaran = :status_pembayaran `;
        }
        if (start_date && end_date) {
            whereClausePK += ` AND pk.tanggal_pembayaran BETWEEN :start_date AND :end_date `;
            whereClausePP += ` AND pp.tanggal_pembayaran BETWEEN :start_date AND :end_date `;
        }
        if (type) {
            if (type == "all") {
                whereClause += `  `;
            } else {
                whereClause += ` WHERE combined.type = :type `;
            }

        }

        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 10;
        const offset = (pageNumber - 1) * limitNumber;
        let data = await sq.query(
            `SELECT * FROM (
                SELECT 
                    pk.midtrans_order_id AS order_id,
                    u1.nama AS user,
                    pk.harga,
                    pk.status_pembayaran AS status,
                    pk.tanggal_pembayaran,
                    'kelas' AS type
                FROM pembayaran_kelas pk
                LEFT JOIN kelas k ON k.kelas_id = pk.kelas_id
                LEFT JOIN \`user\` u1 ON u1.user_id = pk.user_id
                ${whereClausePK}
                UNION ALL
                SELECT 
                    pp.midtrans_order_id AS order_id,
                    u2.nama AS user,
                    pp.harga,
                    pp.status_pembayaran AS status,
                    pp.tanggal_pembayaran,
                    'poin' AS type
                FROM pembayaran_poin pp
                LEFT JOIN poin p ON p.poin_id = pp.poin_id
                LEFT JOIN \`user\` u2 ON u2.user_id = pp.user_id
                ${whereClausePP}
            ) AS combined
            ${whereClause}
            ORDER BY combined.tanggal_pembayaran DESC
            LIMIT :limit OFFSET :offset;`,
            {
                replacements: {
                    search: `%${search}%`,
                    status_pembayaran,
                    start_date,
                    end_date,
                    limit: limitNumber,
                    offset,
                    type
                },
                type: QueryTypes.SELECT,
            }
        );
        const totalDataResult = await sq.query(
            `SELECT COUNT(DISTINCT order_id) as total
            FROM (
                SELECT 
                    pk.midtrans_order_id AS order_id,
                    u1.nama AS user,
                    pk.harga,
                    pk.status_pembayaran AS status,
                    pk.tanggal_pembayaran,
                    'kelas' AS type
                FROM pembayaran_kelas pk
                LEFT JOIN kelas k ON k.kelas_id = pk.kelas_id
                LEFT JOIN \`user\` u1 ON u1.user_id = pk.user_id
                ${whereClausePK}
                UNION ALL
                SELECT 
                    pp.midtrans_order_id AS order_id,
                    u2.nama AS user,
                    pp.harga,
                    pp.status_pembayaran AS status,
                    pp.tanggal_pembayaran,
                    'poin' AS type
                FROM pembayaran_poin pp
                LEFT JOIN poin p ON p.poin_id = pp.poin_id
                LEFT JOIN \`user\` u2 ON u2.user_id = pp.user_id
                ${whereClausePP}
            ) as combined ${whereClause}`,
            {
                replacements: {
                    search: `%${search}%`,
                    status_pembayaran,
                    start_date,
                    end_date,
                    type
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
};

export const getDetailTransaksi = async (req: Request, res: Response): Promise<any> => {
    try {
        let { id } = req.params;
        const { id: extractedId, kategori } = extractOrderId(id as string);
        console.log("🚀 ~ getDetailTransaksi ~ kategori:", kategori)
        console.log("🚀 ~ getDetailTransaksi ~ extractedId:", extractedId)
        let data_pembayaran: PembayaranType = null
        if (!extractedId) {
            return res.status(400).json({ message: "Harap isi semua data yang diperlukan" });
        }
        if (kategori == "poin") {
            data_pembayaran = await PembayaranPoin.findByPk(extractedId);
        }
        if (kategori == "kelas") {
            data_pembayaran = await PembayaranKelas.findByPk(extractedId);
        }

        if (!data_pembayaran) {
            return res.status(404).json({ message: "Kelas tidak ditemukan" });
        }
        try {
            const status = await statusTransaction({
                server_key: process.env.SERVER_KEY as string,
                data: { order_id: data_pembayaran.midtrans_order_id }
            });
            if (data_pembayaran.status_pembayaran != "paid") {
                if (status) {
                    if (status.status_code != 404) {
                        if (status.transaction_status === "capture" || status.transaction_status === "settlement") {
                            if (kategori === "kelas" && data_pembayaran instanceof PembayaranKelas) {
                                await PembayaranKelas.update(
                                    {
                                        status_pembayaran: "paid",
                                        tanggal_pembayaran: status.transaction_time
                                    },
                                    { where: { pembayaran_kelas_id: extractedId } }
                                );
                                await KelasSiswa.create({
                                    user_id: data_pembayaran.user_id,
                                    kelas_id: data_pembayaran.kelas_id
                                });
                            }
                            if (kategori === "poin" && data_pembayaran instanceof PembayaranPoin) {
                                const dataUser = await User.findByPk(data_pembayaran.user_id);
                                const dataPoin = await Poin.findByPk(data_pembayaran.poin_id);
                                if (!dataUser || !dataPoin) {
                                    return res.status(404).json({ message: "Data user atau poin tidak ditemukan" });
                                }

                                await PembayaranPoin.update(
                                    {
                                        status_pembayaran: "paid",
                                        tanggal_pembayaran: status.transaction_time
                                    },
                                    { where: { pembayaran_poin_id: extractedId } }
                                );

                                await User.update(
                                    { poin: (dataUser.poin ?? 0) + (dataPoin.jumlah_poin ?? 0) },
                                    { where: { user_id: data_pembayaran.user_id } }
                                );
                            }

                        } else if (status.transaction_status === "cancel" || status.transaction_status === "expire") {
                            if (kategori === "kelas" && data_pembayaran instanceof PembayaranKelas) {
                                await PembayaranKelas.update(
                                    { status_pembayaran: "failed" },
                                    { where: { pembayaran_kelas_id: extractedId } }
                                );
                            }
                            if (kategori === "poin" && data_pembayaran instanceof PembayaranPoin) {
                                await PembayaranPoin.update(
                                    { status_pembayaran: "failed" },
                                    { where: { pembayaran_poin_id: extractedId } }
                                );
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.log("🚀 ~ getDetailTransaksi ~ error:", error)
        } finally {
            return res.status(200).json({ data: data_pembayaran });
        }

    } catch (error: any) {
        console.log("🚀 ~ getDetailTransaksi ~ error:", error)
        return res.status(500).json({
            message: "Terjadi kesalahan",
            error: error?.response?.data?.error_messages || error?.message || "Unknown error",
        });
    }

};

export const handlePaymentNotification = async (req: Request, res: Response): Promise<any> => {
    try {
        const {
            transaction_time,
            transaction_status,
            order_id,
            gross_amount,
            signature_key,
            status_code,
        } = req.body;
        const expectedSignature = crypto
            .createHash("sha512")
            .update(`${order_id}${status_code}${gross_amount}${process.env.SERVER_KEY}`)
            .digest("hex");

        if (signature_key !== expectedSignature) {
            return res.status(401).json({ message: "Unauthorized: Invalid signature" });
        }
        const { id: extractedId, kategori } = extractOrderId(order_id as string);
        let data_pembayaran: PembayaranType = null
        if (!extractedId) {
            return res.status(400).json({ message: "Harap isi semua data yang diperlukan" });
        }
        if (kategori == "poin") {
            data_pembayaran = await PembayaranPoin.findByPk(extractedId);
        }
        if (kategori == "kelas") {
            data_pembayaran = await PembayaranKelas.findByPk(extractedId);
        }

        if (!data_pembayaran) {
            return res.status(404).json({ message: "Kelas tidak ditemukan" });
        }
        if (transaction_status === "capture" || transaction_status === "settlement") {
            if (kategori === "kelas" && data_pembayaran instanceof PembayaranKelas) {
                await PembayaranKelas.update(
                    {
                        status_pembayaran: "paid",
                        tanggal_pembayaran: transaction_time
                    },
                    { where: { pembayaran_kelas_id: extractedId } }
                );
                await KelasSiswa.create({
                    user_id: data_pembayaran.user_id,
                    kelas_id: data_pembayaran.kelas_id
                });
            }
            if (kategori === "poin" && data_pembayaran instanceof PembayaranPoin) {
                const dataUser = await User.findByPk(data_pembayaran.user_id);
                const dataPoin = await Poin.findByPk(data_pembayaran.poin_id);
                if (!dataUser || !dataPoin) {
                    return res.status(404).json({ message: "Data user atau poin tidak ditemukan" });
                }

                await PembayaranPoin.update(
                    {
                        status_pembayaran: "paid",
                        tanggal_pembayaran: transaction_time
                    },
                    { where: { pembayaran_poin_id: extractedId } }
                );

                await User.update(
                    { poin: (dataUser.poin ?? 0) + (dataPoin.jumlah_poin ?? 0) },
                    { where: { user_id: data_pembayaran.user_id } }
                );
            }

        } else if (transaction_status === "cancel" || transaction_status === "expire") {
            if (kategori === "kelas" && data_pembayaran instanceof PembayaranKelas) {
                await PembayaranKelas.update(
                    { status_pembayaran: "failed" },
                    { where: { pembayaran_kelas_id: extractedId } }
                );
            }
            if (kategori === "poin" && data_pembayaran instanceof PembayaranPoin) {
                await PembayaranPoin.update(
                    { status_pembayaran: "failed" },
                    { where: { pembayaran_poin_id: extractedId } }
                );
            }
        }

        return res.status(400).json({ message: "Unhandled transaction status" });

    } catch (error) {
        console.error("🚀 ~ handlePaymentNotification ~ error:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};