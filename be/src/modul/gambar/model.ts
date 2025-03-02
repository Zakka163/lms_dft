import { Model, DataTypes } from "sequelize";
import { sq } from "../../config/connection.js";

class Gambar extends Model { }

Gambar.init(
    {
        gambar_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize: sq,
        modelName: "gambar",
        tableName: "gambar",
        timestamps: true,
        paranoid: true,
    }
);

export default Gambar;
