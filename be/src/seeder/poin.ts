import Poin from "../modul/poin/model.js"; // Sesuaikan dengan lokasi model Poin
import {sq} from '../config/connection.js'
export const seedPoin = async () => {
    try {
        await sq.authenticate(); // Pastikan koneksi ke database berhasil

        const data = [
            { nama_poin: "Poin Silver 100", jumlah_poin: 100, harga_normal: 50000, harga_diskon: 45000, deskripsi: "Paket poin silver dengan 100 poin.", status: true },
            { nama_poin: "Poin Silver 200", jumlah_poin: 200, harga_normal: 90000, harga_diskon: 85000, deskripsi: "Paket poin silver dengan 200 poin.", status: true },
            { nama_poin: "Poin Gold 250", jumlah_poin: 250, harga_normal: 120000, harga_diskon: 100000, deskripsi: "Paket poin gold dengan 250 poin.", status: true },
            { nama_poin: "Poin Gold 500", jumlah_poin: 500, harga_normal: 240000, harga_diskon: 210000, deskripsi: "Paket poin gold dengan 500 poin.", status: true },
            { nama_poin: "Poin Platinum 750", jumlah_poin: 750, harga_normal: 360000, harga_diskon: 330000, deskripsi: "Paket poin platinum dengan 750 poin.", status: false },
            { nama_poin: "Poin Platinum 1000", jumlah_poin: 1000, harga_normal: 480000, harga_diskon: 450000, deskripsi: "Paket poin platinum dengan 1000 poin.", status: true },
            { nama_poin: "Poin Diamond 1250", jumlah_poin: 1250, harga_normal: 600000, harga_diskon: 550000, deskripsi: "Paket poin diamond dengan 1250 poin.", status: false },
            { nama_poin: "Poin Diamond 1500", jumlah_poin: 1500, harga_normal: 720000, harga_diskon: 680000, deskripsi: "Paket poin diamond dengan 1500 poin.", status: true },
            { nama_poin: "Poin Titanium 1750", jumlah_poin: 1750, harga_normal: 850000, harga_diskon: 800000, deskripsi: "Paket poin titanium dengan 1750 poin.", status: false },
            { nama_poin: "Poin Titanium 2000", jumlah_poin: 2000, harga_normal: 960000, harga_diskon: 900000, deskripsi: "Paket poin titanium dengan 2000 poin.", status: true },
        ];

        // Menambahkan 10 data tambahan otomatis
        for (let i = 1; i <= 10; i++) {
            data.push({
                nama_poin: `Poin Special ${i}`,
                jumlah_poin: i * 100,
                harga_normal: i * 50000,
                harga_diskon: i * 48000,
                deskripsi: `Paket poin spesial ${i} dengan ${i * 100} poin.`,
                status: i % 2 === 0, // Bergantian antara true dan false
            });
        }

        await Poin.bulkCreate(data);
        console.log("✅ 20 Data Poin berhasil ditambahkan.");
    } catch (error) {
        console.error("❌ Gagal menambahkan data Poin:", error);
    } finally {
        // await sq.close(); // Tutup koneksi setelah selesai
    }
};


