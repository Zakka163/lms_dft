import { Model, DataTypes } from "sequelize";
import { sq } from "../../config/connection.js";
import Kelas from "../kelas/model.js";

class Materi extends Model {
    materi_id: number | undefined;
    nama_materi: any;
    urutan: any;
    kelas_id: any;
}

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
  },
  {
    sequelize: sq,
    modelName: "materi",
    tableName: "materi",
    timestamps: true,
    paranoid: true,
  }
);
Kelas.hasMany(Materi, { foreignKey: "kelas_id" });
Materi.belongsTo(Kelas, { foreignKey: "kelas_id" });


export default Materi;
