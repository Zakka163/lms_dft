import { Model, DataTypes } from "sequelize";
import { sq } from "../../config/connection.js";
import Materi from "../materi/model.js";

class SubMateri extends Model { }

SubMateri.init(
  {
    sub_materi_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nama_sub_materi: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    materi_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    urutan: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING, // text , link
      allowNull: true,
    },
    is_free: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  },
  {
    sequelize: sq,
    modelName: "sub_materi",
    tableName: "sub_materi",
    timestamps: true,
    paranoid: true,
  }
);

Materi.hasMany(SubMateri, { foreignKey: "materi_id" });
SubMateri.belongsTo(Materi, { foreignKey: "materi_id" });

export default SubMateri;
