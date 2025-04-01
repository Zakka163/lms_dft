import { DataTypes, Model } from "sequelize";
import { sq } from "../../config/connection.js";
import Gambar from "../gambar/model.js";

class user extends Model {
  public user_id!: number;
  public nama!: string;
  public password!: string;
  public email!: string;
  public kelamin!: "L" | "P"; 
  public nomor_telpon!: string;
  public role!: "admin" | "siswa";
  public poin!: number;
}

user.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    kelamin: {
      type: DataTypes.ENUM("L", "P"),
      allowNull: true,
    },
    nomor_telpon: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue:"-"
    },
    role: {
      type: DataTypes.ENUM("admin", "siswa"),
      allowNull: false,
      defaultValue: "siswa",
    },
    poin: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize: sq,
    modelName: "user",
    tableName: "user",
    timestamps: true,
    paranoid: true, 
  }
);

Gambar.hasMany(user, { foreignKey: "gambar_id"});
user.belongsTo(Gambar, { foreignKey: "gambar_id"});

export default user;
