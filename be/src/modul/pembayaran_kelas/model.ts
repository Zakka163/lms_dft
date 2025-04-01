import { Model, DataTypes } from "sequelize";
import { sq } from "../../config/connection.js";
import User from "../user/model.js";
import Kelas from "../kelas/model.js";

interface PembayaranKelasAttributes {
    pembayaran_kelas_id?: number;
    harga: number;
    status_pembayaran: string;
    tanggal_pembayaran?: Date;
    user_id: number;
    kelas_id: number;
    midtrans_order_id?: string;
}

class PembayaranKelas extends Model<PembayaranKelasAttributes> implements PembayaranKelasAttributes {
    public pembayaran_kelas_id!: number;
    public harga!: number;
    public status_pembayaran!: string;
    public tanggal_pembayaran!: Date;
    public user_id!: number;
    public kelas_id!: number;
    public midtrans_order_id!: string;
}

PembayaranKelas.init(
    {
        pembayaran_kelas_id: {
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
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "user_id",
            },
        },
        kelas_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Kelas,
                key: "kelas_id",
            },
        },
    },
    {
        sequelize: sq,
        modelName: "pembayaran_kelas",
        tableName: "pembayaran_kelas",
        timestamps: true,
        paranoid: true,
    }
);

User.hasMany(PembayaranKelas, { foreignKey: "user_id" });
PembayaranKelas.belongsTo(User, { foreignKey: "user_id" });

Kelas.hasMany(PembayaranKelas, { foreignKey: "kelas_id" });
PembayaranKelas.belongsTo(Kelas, { foreignKey: "kelas_id" });

export default PembayaranKelas;