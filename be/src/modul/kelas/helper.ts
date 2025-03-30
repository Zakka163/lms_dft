import { Request, Response } from "express";
import kelas_m from "./model.js";
import { sq } from "../../config/connection.js";
import QueryTypes from "sequelize/lib/query-types";
import kelas_kategori_m from "../kategori_kelas/model.js"
import materi_m from "../materi/model.js"
import sub_materi_m from "../sub_materi/model.js"
import { Op, Transaction } from "sequelize";


export async function updateKelas(kelas: any, data: any, transaction: Transaction) {
    await kelas.update({
        nama_kelas: data.nama_kelas,
        deskripsi_kelas: data.deskripsi_kelas,
        poin_reward: data.poin_reward,
        background_kelas: data.background_kelas || kelas.background_kelas,
        harga_kelas: data.harga_kelas,
        harga_diskon_kelas: data.harga_diskon_kelas,
        pembelajaran_kelas: data.pembelajaran_kelas,
        status_kelas: data.status_kelas,
        pengajar: data.pengajar,
    }, { transaction });
}

export async function updateKategoriKelas(kelasId: string, kategori: any[], transaction: Transaction) {
    if (!Array.isArray(kategori)) return;

    await kelas_kategori_m.destroy({ where: { kelas_id: kelasId }, force: true, transaction });

    if (kategori.length > 0) {
        const kategoriKelasData = kategori.map((data: any) => ({
            kelas_id: kelasId,
            sub_kategori_id: data.sub_kategori_id,
        }));
        await kelas_kategori_m.bulkCreate(kategoriKelasData, { transaction });
    }
}
export async function updateMateriKelas(kelasId: string, materi: any[], transaction: Transaction) {
    if (!Array.isArray(materi)) return;

    const dataBaru = materi.filter(item => item.isNew === true);
    const dataLama = materi.filter(item => !item.isNew);

    if (dataLama.length > 0) {
        await updateMateriQuery(dataLama, transaction);
    }

    if (dataBaru.length > 0) {
        const materiData = dataBaru.map((materiItem) => ({
            nama_materi: materiItem.name,
            urutan: materiItem.order,
            kelas_id: kelasId,
        }));
        await materi_m.bulkCreate(materiData, { transaction });
    }
}
export async function updateMateriQuery(materi: any[], transaction: Transaction) {
    const updateNamaMateriCases = materi.map((m, i) => `WHEN materi_id = :id${i} THEN :name${i}`).join(" ");
    const updateUrutanCases = materi.map((m, i) => `WHEN materi_id = :id${i} THEN :order${i}`).join(" ");

    const updateQuery = `
        UPDATE materi 
        SET 
            nama_materi = CASE ${updateNamaMateriCases} END,
            urutan = CASE ${updateUrutanCases} END
        WHERE materi_id IN (${materi.map((_, i) => `:id${i}`).join(", ")});
    `;

    const bindParams: Record<string, any> = {};
    materi.forEach((m, i) => {
        bindParams[`id${i}`] = m.id;
        bindParams[`name${i}`] = m.name;
        bindParams[`order${i}`] = m.order;
    });

    await sq.query(updateQuery, {
        transaction,
        replacements: bindParams
    });
}