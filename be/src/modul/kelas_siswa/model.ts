import { Model, DataTypes } from "sequelize";
import { sq } from "../../config/connection.js";
import Kelas from "../kelas/model.js";
import User from "../user/model.js";

class KelasSiswa extends Model {}

KelasSiswa.init(
  {
    kelas_siswa_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    kelas_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    progress: {
      type: DataTypes.FLOAT, 
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize: sq,
    modelName: "kelas_siswa",
    tableName: "kelas_siswa",
    timestamps: true,
    paranoid: true,
  }
);

// Relasi: Kelas memiliki banyak KelasSiswa
Kelas.hasMany(KelasSiswa, { foreignKey: "kelas_id" });
KelasSiswa.belongsTo(Kelas, { foreignKey: "kelas_id" });

// Relasi: User memiliki banyak KelasSiswa
User.hasMany(KelasSiswa, { foreignKey: "siswa_id" });
KelasSiswa.belongsTo(User, { foreignKey: "siswa_id" });

export default KelasSiswa;
