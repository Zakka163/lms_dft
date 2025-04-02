import axios, { AxiosResponse } from "axios";
import { v4 as uuidv4 } from 'uuid';
interface TransactionResponse {
    token: string;
    redirect_url: string;
}

interface TransactionParams {
    server_key: string;
    data: any
}

export const createTransaction = async ({ server_key, data }: TransactionParams): Promise<any> => {
    console.log("🚀 ~ createTransaction ~ server_key:", server_key)
    try {
        if (!server_key) {
            throw new Error("Server key is required");
        }
        const base64Auth = Buffer.from(`${server_key}:`).toString("base64");
        const response = await axios.post<TransactionResponse>(
            "https://app.sandbox.midtrans.com/snap/v1/transactions",
            {
                "transaction_details": {
                    "order_id": data.order_id,
                    "gross_amount": data.harga
                },
                "credit_card": {
                    "secure": true
                },
                "customer_details": {
                    "first_name": data.nama,
                    "email": data.email,
                }
            },
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Basic ${base64Auth}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Transaction Response:", response.data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const statusTransaction = async ({ server_key, data }: TransactionParams): Promise<any> => {
    try {
        if (!server_key) {
            throw new Error("Server key is required");
        }

        const base64Auth = Buffer.from(`${server_key}:`).toString("base64");

        // Buat kontrol timeout dengan AbortController
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000); // Timeout 5 detik

        const response: AxiosResponse<any> = await axios.get(
            `https://api.sandbox.midtrans.com/v2/${data.order_id}/status`,
            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Basic ${base64Auth}`,
                    "Content-Type": "application/json",
                },
                signal: controller.signal, // Tambahkan signal abort
            }
        );

        clearTimeout(timeout); // Hapus timeout jika berhasil
        console.log("Transaction Status Response:", response.data);
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) {
            console.error("Request timed out");
            throw new Error("Request to Midtrans timed out. Please try again later.");
        }
        throw error;
    }
};

export const extractNumber = (id: string) => {
    if (id.startsWith("kelas")) {
        return { tipe: "kelas", value: id.slice(5) };
    } else if (id.startsWith("poin")) {
        return { tipe: "poin", value: id.slice(4) };
    }
    return { tipe: "unknown", value: null };
};
type ExtractedOrderId = {
    kategori: "kelas" | "poin";
    id: any;
    tanggal: string;
    random: string;
};
export const generateOrderId = (type: string, id: number): string => {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, ""); // Format YYYYMMDD
    const randomPart = uuidv4().split("-")[0]; // Ambil bagian pertama UUID agar lebih pendek
    return `${type}-${id}-${datePart}-${randomPart}`;
};
export const extractOrderId = (order_id: string): ExtractedOrderId => {
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