import { DataTypes, Model } from "sequelize";
import { sq } from "../../config/connection.js";


class Kelas extends Model {
  public kelas_id!: number;
  public nama_kelas!: string;
  public deskripsi_kelas!: string;
  public poin_reward!: number;
  public background_kelas!: string;
  public harga_kelas!: number;
  public harga_diskon_kelas!: number;
  public pembelajaran_kelas!: string;
  public status_kelas!: string;
  public pengajar!: string;
  public is_diskon!:boolean;
}

Kelas.init(
  {
    kelas_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama_kelas: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deskripsi_kelas: {
      type: DataTypes.TEXT,
    },
    poin_reward: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    background_kelas: {
      type: DataTypes.STRING,
    },
    harga_kelas: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    is_diskon: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    harga_diskon_kelas: {
      type: DataTypes.FLOAT,
    },
    pembelajaran_kelas: {
      type: DataTypes.TEXT,
    },
    status_kelas: {
      type: DataTypes.ENUM("aktif", "nonaktif"),
      defaultValue: "aktif",
    },
    pengajar: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sq,
    modelName: "Kelas",
    tableName: "kelas",
    timestamps: true,
    paranoid: true,
  }
);

export default Kelas;
