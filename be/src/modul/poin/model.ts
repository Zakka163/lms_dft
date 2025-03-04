import { Model, DataTypes } from "sequelize";
import { sq } from "../../config/connection.js";


class Poin extends Model { }

Poin.init(
    {
        poin_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
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
            defaultValue: false
        }
    },
    {
        sequelize: sq,
        modelName: "poin",
        tableName: "poin",
        timestamps: true,
        paranoid: true,
    }
);


export default Poin;
