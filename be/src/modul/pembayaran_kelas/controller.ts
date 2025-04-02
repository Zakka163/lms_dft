import { Request, Response } from "express";
import PembayaranKelas from "./model.js";
import { createTransaction, extractNumber, generateOrderId, statusTransaction } from "../../helper.ts/midtrans.js";
import Kelas_m from "../kelas/model.js";
import { RequestWithUser } from "../../helper.ts/model.js";
import crypto from "crypto";

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
        const order_id = generateOrderId("kelas",pembayaran.pembayaran_kelas_id)
        const snap = await createTransaction({
            server_key: process.env.SERVER_KEY as string,
            data: {
                harga,
                order_id: order_id,
                email: user.email,
                nama: user.nama
            }
        });
        console.log("🚀 ~ createPembayaranKelas ~ snap:", snap)
        await PembayaranKelas.update({ midtrans_order_id: order_id, url_midtrans: snap.redirect_url }, { where: { pembayaran_kelas_id: pembayaran.pembayaran_kelas_id } })
        return res.status(201).json({ message: "Pembayaran berhasil dibuat", data: snap });
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
