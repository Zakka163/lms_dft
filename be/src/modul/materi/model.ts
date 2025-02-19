import { Model, DataTypes } from "sequelize";
import { sq } from "../../config/connection.js";

class Materi extends Model {}

Materi.init(
  {
    materi_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_materi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    kelas_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    urutan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: sq,
    modelName: "materi",
    tableName: "materi",
    timestamps: true,
    paranoid: true,
  }
);

export default Materi;
