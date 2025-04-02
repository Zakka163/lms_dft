import { Model, DataTypes } from "sequelize";
import { sq } from "../../config/connection.js";
import User from "../user/model.js";
import Poin from "../poin/model.js";

interface PembayaranPoinAttributes {
    pembayaran_poin_id?: number;
    harga: number;
    status_pembayaran: string;
    tanggal_pembayaran?: Date;
    user_id: number;
    poin_id: number;
    midtrans_order_id?: string;
    url_midtrans?: string;
}

class PembayaranPoin extends Model<PembayaranPoinAttributes> implements PembayaranPoinAttributes {
    public pembayaran_poin_id!: number;
    public harga!: number;
    public status_pembayaran!: string;
    public tanggal_pembayaran!: Date;
    public user_id!: number;
    public poin_id!: number;
    public midtrans_order_id!: string;
    public url_midtrans!: string;
}

PembayaranPoin.init(
    {
        pembayaran_poin_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        harga: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status_pembayaran: {
            type: DataTypes.STRING, // pending , paid , failed
            allowNull: false,
            defaultValue: "pending",
        },
        tanggal_pembayaran: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        midtrans_order_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        url_midtrans: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "user_id",
            },
        },
        poin_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Poin,
                key: "poin_id",
            },
        },
    },
    {
        sequelize: sq,
        modelName: "pembayaran_poin",
        tableName: "pembayaran_poin",
        timestamps: true,
        paranoid: true,
    }
);

User.hasMany(PembayaranPoin, { foreignKey: "user_id" });
PembayaranPoin.belongsTo(User, { foreignKey: "user_id" });

Poin.hasMany(PembayaranPoin, { foreignKey: "poin_id" });
PembayaranPoin.belongsTo(Poin, { foreignKey: "poin_id" });

export default PembayaranPoin;