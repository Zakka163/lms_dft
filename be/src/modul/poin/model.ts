import { Model, DataTypes, Optional } from "sequelize";
import { sq } from "../../config/connection.js";

// Definisi atribut untuk Poin
interface PoinAttributes {
    poin_id: number;
    is_diskon: boolean;
    nama_poin: string;
    jumlah_poin: number;
    harga_normal: number;
    harga_diskon: number;
    deskripsi: string;
    status: boolean;
}

// Opsi atribut yang bisa dikosongkan saat pembuatan instance baru
interface PoinCreationAttributes extends Optional<PoinAttributes, "poin_id"> {}

class Poin extends Model<PoinAttributes, PoinCreationAttributes> implements PoinAttributes {
    public poin_id!: number;
    public is_diskon!: boolean;
    public nama_poin!: string;
    public jumlah_poin!: number;
    public harga_normal!: number;
    public harga_diskon!: number;
    public deskripsi!: string;
    public status!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

Poin.init(
    {
        poin_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        is_diskon: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        nama_poin: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        jumlah_poin: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        harga_normal: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        harga_diskon: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        deskripsi: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        sequelize: sq,
        modelName: "Poin",
        tableName: "poin",
        timestamps: true,
        paranoid: true,
    }
);

export default Poin;