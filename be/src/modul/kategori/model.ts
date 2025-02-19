import { DataTypes, Model } from "sequelize";
import { sq } from "../../config/connection.js";

class kategori extends Model {
    public ms_schedule_id!: number;
    public name!: string;
}

kategori.init(
    {
        kategori_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nama_kategori: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize: sq,
        modelName: "kategori",
        tableName: "kategori",
        timestamps: true,
        paranoid: true,
    }
);

export default kategori;
