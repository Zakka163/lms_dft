import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
import { sq } from '../../config/connection.js';
import PembayaranKelas from '../pembayaran_kelas/model.js';
import KelasSiswa from '../kelas_siswa/model.js';
import { statusTransaction } from '../pembayaran_kelas/service.js';
const extractOrderId = (order_id: string): any => {
    const regex = /^(kelas|poin)-(\d+)-(\d{8})-([a-z0-9]+)$/;
    const match = order_id.match(regex);

    if (!match) {
        throw new Error("Format order_id tidak valid");
    }

    return {
        kategori: match[1] as "kelas" | "poin", // Menentukan apakah kategori kelas atau poin
        id: parseInt(match[2], 10),
        tanggal: match[3],
        random: match[4],
    };
};

export const getTransaksi = async (req: Request, res: Response): Promise<any> => {
    try {
        const { search, status_pembayaran, start_date, end_date, page, limit } = req.query;
        let whereClause = ` WHERE pk.deletedAt IS NULL`;

        // Filter berdasarkan pencarian, status pembayaran, dan rentang tanggal
        if (search) {
            whereClause += ` AND u.nama LIKE :search `;
        }
        if (status_pembayaran) {
            whereClause += ` AND pk.status_pembayaran = :status_pembayaran `;
        }
        if (start_date && end_date) {
            whereClause += ` AND pk.tanggal_pembayaran BETWEEN :start_date AND :end_date `;
        }

        const pageNumber = Number(page) || 1;
        const limitNumber = Number(limit) || 10;
        const offset = (pageNumber - 1) * limitNumber;

        // Query utama untuk mendapatkan data transaksi pembayaran
        let data = await sq.query(
            `SELECT 
                pk.midtrans_order_id as order_id,
                u.nama as user,
                pk.harga,
                pk.status_pembayaran as status,
                pk.tanggal_pembayaran
            FROM pembayaran_kelas pk
            LEFT JOIN kelas k ON k.kelas_id = pk.kelas_id
            LEFT JOIN \`user\` u ON u.user_id = pk.user_id
            ${whereClause}
            ORDER BY pk.tanggal_pembayaran DESC
            LIMIT :limit OFFSET :offset;`,
            {
                replacements: {
                    search: `%${search}%`,
                    status_pembayaran,
                    start_date,
                    end_date,
                    limit: limitNumber,
                    offset,
                },
                type: QueryTypes.SELECT,
            }
        );

        // Query untuk menghitung total data transaksi pembayaran
        const totalDataResult = await sq.query(
            `SELECT COUNT(DISTINCT pk.midtrans_order_id) as total
            FROM pembayaran_kelas pk
            LEFT JOIN kelas k ON k.kelas_id = pk.kelas_id
            LEFT JOIN \`user\` u ON u.user_id = pk.user_id
            ${whereClause}`,
            {
                replacements: {
                    search: `%${search}%`,
                    status_pembayaran,
                    start_date,
                    end_date,
                },
                type: QueryTypes.SELECT,
            }
        );

        const totalData = (totalDataResult as { total: number }[])[0]?.total || 0;
        const totalPages = Math.ceil(totalData / limitNumber);

        // Menyusun respons dengan data dan informasi pagination
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

export const getDetailTransaksi = async (req: Request, res: Response): Promise<any> => {
    try {
        let { id } = req.params;
        const extractedId = extractOrderId(id).id;

        if (!extractedId) {
            return res.status(400).json({ message: "Harap isi semua data yang diperlukan" });
        }
        const data_pembayaran = await PembayaranKelas.findByPk(extractedId);
        if (!data_pembayaran) {
            return res.status(404).json({ message: "Kelas tidak ditemukan" });
        }
        const status = await statusTransaction({
            server_key: process.env.SERVER_KEY as string,
            data: { order_id: data_pembayaran.midtrans_order_id }
        });

        if (status) {
            if (status.status_code != 404) {
                if (status.transaction_status === "capture" || status.transaction_status === "settlement") {
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
                } else if (status.transaction_status === "cancel" || status.transaction_status === "expire") {
                    await PembayaranKelas.update(
                        { status_pembayaran: "failed" },
                        { where: { pembayaran_kelas_id: extractedId } }
                    );
                }
            }

        }

        return res.status(200).json({ data: data_pembayaran });

    } catch (error: any) {
        return res.status(500).json({
            message: "Terjadi kesalahan",
            error: error?.response?.data?.error_messages || error?.message || "Unknown error",
        });
    }

};