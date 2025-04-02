import { Request, Response } from "express";
import { createTransaction, extractNumber, generateOrderId, statusTransaction } from "../../helper.ts/midtrans.js";
import { RequestWithUser } from "../../helper.ts/model.js";
import Poin from "../poin/model.js";
import PembayaranPoin from "./model.js";

export const createPembayaranPoin = async (req: RequestWithUser, res: Response): Promise<any> => {
    try {
        const { poin_id } = req.body;
        const user = req.user;
        let harga: number;

        if (!poin_id) {
            return res.status(400).json({ message: "Harap isi semua data yang diperlukan" });
        }
        const data_poin = await Poin.findByPk(poin_id);
        if (!data_poin) {
            return res.status(404).json({ message: "Poin tidak ditemukan" });
        }
        harga = data_poin.is_diskon ? data_poin.harga_diskon as number : data_poin.harga_normal as number;
        const pembayaran = await PembayaranPoin.create({
            harga,
            status_pembayaran: "pending",
            tanggal_pembayaran: new Date(),
            user_id: user.user_id,
            poin_id
        });
        const order_id = generateOrderId("poin",pembayaran.pembayaran_poin_id)
        console.log("🚀 ~ createPembayaranPoin ~ order_id:", order_id)
        const snap = await createTransaction({
            server_key: process.env.SERVER_KEY as string,
            data: {
                harga,
                order_id: order_id,
                email: user.email,
                nama: user.nama
            }
        });
        await PembayaranPoin.update({ midtrans_order_id: order_id, url_midtrans: snap.redirect_url }, { where: { pembayaran_poin_id: pembayaran.pembayaran_poin_id } })
        return res.status(201).json({ message: "Pembayaran berhasil dibuat", data: snap });
    } catch (error: any) {
        console.error("🚀 ~ createPembayaranKelas ~ error:", error?.response?.data?.error_messages || error?.message || error);

        return res.status(500).json({
            message: "Terjadi kesalahan",
            error: error?.response?.data?.error_messages || error?.message || "Unknown error",
        });
    }
};
