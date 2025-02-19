import { DataTypes, Model } from "sequelize";
import { sq } from "../../config/connection.js";
import Kelas from "../kelas/model.js";
import SubKategori from "../sub_kategori/model.js";

class KategoriKelas extends Model {
  public kategori_kelas_id!: number;
  public sub_kategori_id!: number;
  public kelas_id!: number;
}

KategoriKelas.init(
  {
    kategori_kelas_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sub_kategori_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: SubKategori,
        key: "sub_kategori_id",
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
    modelName: "KategoriKelas",
    tableName: "kategori_kelas",
    timestamps: true,
    paranoid: true,
  }
);

Kelas.belongsToMany(SubKategori, {
  through: KategoriKelas,
  foreignKey: "kelas_id",
});

SubKategori.belongsToMany(Kelas, {
  through: KategoriKelas,
  foreignKey: "sub_kategori_id"
});

export default KategoriKelas;
