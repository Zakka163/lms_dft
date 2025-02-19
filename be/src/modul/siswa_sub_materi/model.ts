import { Model, DataTypes } from "sequelize";
import { sq } from "../../config/connection.js";
import KelasSiswa from "../kelas_siswa/model.js";
import SubMateri from "../sub_materi/model.js";

class SiswaSubMateri extends Model {}

SiswaSubMateri.init(
  {
    kelas_siswa_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    sub_materi_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    status_progress_kelas: {
      type: DataTypes.STRING, // Misalnya: "Belum Mulai", "Sedang Belajar", "Selesai"
      allowNull: false,
    },
  },
  {
    sequelize: sq,
    modelName: "siswa_sub_materi",
    tableName: "siswa_sub_materi",
    timestamps: true,
    paranoid: true,
}
);


KelasSiswa.hasMany(SiswaSubMateri, { foreignKey: "kelas_siswa_id" });
SiswaSubMateri.belongsTo(KelasSiswa, { foreignKey: "kelas_siswa_id" });


SubMateri.hasMany(SiswaSubMateri, { foreignKey: "sub_materi_id" });
SiswaSubMateri.belongsTo(SubMateri, { foreignKey: "sub_materi_id" });

export default SiswaSubMateri;
