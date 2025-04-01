import { Request, Response } from "express";
import PembayaranKelas from "./model.js";
import { Op, where } from "sequelize";
import { MidtransClient } from 'midtrans-node-client';
import { v4 as uuidv4 } from 'uuid';
import { createTransaction, extractNumber, statusTransaction } from "./service.js";
import Kelas_m from "../kelas/model.js";
import { RequestWithUser } from "../../helper.ts/model.js";
import crypto from "crypto";
import KelasSiswa from "../kelas_siswa/model.js";

type ExtractedOrderId = {
    kategori: "kelas" | "poin";
    id: any;
    tanggal: string;
    random: string;
};
const generateOrderId = (pembayaran_kelas_id: number): string => {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, ""); // Format YYYYMMDD
    const randomPart = uuidv4().split("-")[0]; // Ambil bagian pertama UUID agar lebih pendek
    return `kelas-${pembayaran_kelas_id}-${datePart}-${randomPart}`;
};
const extractOrderId = (order_id: string): ExtractedOrderId => {
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
export const createPembayaranKelas = async (req: RequestWithUser, res: Response): Promise<any> => {
    try {
        const { kelas_id } = req.body;
        const user = req.user;
        let harga: number;

        if (!kelas_id) {
            return res.status(400).json({ message: "Harap isi semua data yang diperlukan" });
        }
        const data_kelas = await Kelas_m.findByPk(kelas_id);
        if (!data_kelas) {
            return res.status(404).json({ message: "Kelas tidak ditemukan" });
        }
        harga = data_kelas.is_diskon ? data_kelas.harga_diskon_kelas as number : data_kelas.harga_kelas as number;
        const pembayaran = await PembayaranKelas.create({
            harga,
            status_pembayaran: "pending",
            tanggal_pembayaran: new Date(),
            user_id: user.user_id,
            kelas_id
        });
        const order_id = generateOrderId(pembayaran.pembayaran_kelas_id)
        const snap = await createTransaction({
            server_key: process.env.SERVER_KEY as string,
            data: {
                harga,
                order_id: order_id,
                email: user.email,
                nama: user.nama
            }
        });
        await PembayaranKelas.update({ midtrans_order_id: order_id }, { where: { pembayaran_kelas_id: pembayaran.pembayaran_kelas_id } })
        return res.status(201).json({ message: "Pembayaran berhasil dibuat", data: snap });
    } catch (error: any) {
        console.error("🚀 ~ createPembayaranKelas ~ error:", error?.response?.data?.error_messages || error?.message || error);

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
        const data = extractOrderId(order_id)
        if (transaction_status === "capture" || transaction_status === "settlement") {
            const data_pembayaran = await PembayaranKelas.findByPk(data.id as string);
            if (!data_pembayaran) {
                return res.status(404).json({ message: "pembayaran tidak ditemukan" });
            }
            await PembayaranKelas.update(
                { status_pembayaran: "paid", tanggal_pembayaran: transaction_time },
                { where: { pembayaran_kelas_id: order_id } }
            );
            await KelasSiswa.create({
                user_id: data_pembayaran.user_id,
                kelas_id: data_pembayaran.kelas_id
            })
            return res.status(200).json({ message: "Payment updated successfully" });
        } else if (transaction_status === "cancel" || transaction_status === "expire") {
            await PembayaranKelas.update(
                { status_pembayaran: "failed" },
                { where: { pembayaran_kelas_id: order_id } }
            );

            return res.status(200).json({ message: "Payment marked as failed" });
        }

        return res.status(400).json({ message: "Unhandled transaction status" });

    } catch (error) {
        console.error("🚀 ~ handlePaymentNotification ~ error:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};
export const getStatus = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Harap isi semua data yang diperlukan" });
        }
        const data_pembayaran = await PembayaranKelas.findByPk(id);
        if (!data_pembayaran) {
            return res.status(404).json({ message: "Kelas tidak ditemukan" });
        }
        const status = statusTransaction({ server_key: process.env.SERVER_KEY as string, data: { order_id: data_pembayaran.midtrans_order_id } })
        return res.status(201).json({ message: "Pembayaran berhasil dibuat", data: status });
    } catch (error: any) {
        console.error("🚀 ~ createPembayaranKelas ~ error:", error?.response?.data?.error_messages || error?.message || error);

        return res.status(500).json({
            message: "Terjadi kesalahan",
            error: error?.response?.data?.error_messages || error?.message || "Unknown error",
        });
    }
};
export const createSign = async (req: Request, res: Response): Promise<any> => {
    try {
        const {
            order_id,
            gross_amount,
            status_code,
        } = req.body;
        return res.status(200).json({
            data: crypto
                .createHash("sha512")
                .update(`${order_id}${status_code}${gross_amount}${process.env.SERVER_KEY}`)
                .digest("hex")
        });

    } catch (error) {
        console.error("🚀 ~ handlePaymentNotification ~ error:", error);
        return res.status(500).json({ message: "Internal server error", error });
    }
};
