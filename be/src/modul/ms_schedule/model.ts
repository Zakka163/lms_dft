import { DataTypes, Model } from "sequelize";
import { sq } from "../../config/connection.js";

class MsSchedule extends Model {
  public ms_schedule_id!: number;
  public hari!: string;
  public jam_awal!: string;
  public jam_akhir!: string;
  public status!: boolean;
}

MsSchedule.init(
  {
    ms_schedule_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    hari: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    jam_awal: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    jam_akhir: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize: sq,
    modelName: "MsSchedule",
    tableName: "ms_schedule",
    timestamps: true,
    paranoid: true, 
  }
);

export default MsSchedule;
