import { DataTypes, Model } from "sequelize";
import { sq } from "../../config/connection.js";
import kategori from "../kategori/model.js";

class SubKategori extends Model {
    public sub_kategori_id!: number;
    public nama_sub_kategori!: string;
    public kategori_id!: number;
}

SubKategori.init(
    {
        sub_kategori_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        nama_sub_kategori: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        kategori_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: kategori,
                key: "kategori_id",
            },
        },
    },
    {
        sequelize: sq,
        modelName: "sub_kategori",
        tableName: "sub_kategori",
        timestamps: true,
        paranoid: true,
    }
);

// Relasi One-to-Many
kategori.hasMany(SubKategori, { foreignKey: "kategori_id"});
SubKategori.belongsTo(kategori, { foreignKey: "kategori_id"});

export default SubKategori;
