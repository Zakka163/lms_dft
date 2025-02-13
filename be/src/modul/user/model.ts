import { DataTypes, Model } from "sequelize";
import { sq } from "../../config/connection.js";

class User extends Model {
  public user_id!: number;
  public nama!: string;
  public password!: string;
  public email!: string;
  public kelamin!: "L" | "P"; 
  public nomor_telpon!: string;
  public role!: "admin" | "siswa";
  public poin!: number;
}

User.init(
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
      allowNull: false,
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
      allowNull: false,
    },
    nomor_telpon: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isNumeric: true,
      },
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
    modelName: "User",
    tableName: "User",
    timestamps: true,
    paranoid: true, 
  }
);

export default User;
