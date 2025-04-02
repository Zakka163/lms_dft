import axios from "axios";

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
        const response = await axios.get<any>(
            `https://api.sandbox.midtrans.com/v2/${data.order_id}/status`,

            {
                headers: {
                    Accept: "application/json",
                    Authorization: `Basic ${base64Auth}`,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Transaction Status Response:", response.data);
        return response.data;
    } catch (error) {
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
