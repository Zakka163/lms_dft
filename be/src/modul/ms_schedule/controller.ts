import { Request, Response } from "express";
import MsSchedule from "./model.js";

class MsScheduleController {
    static async getAll(req: Request, res: Response) {
        try {
            const { hari, status } = req.query;

            let whereClause: any = {};

            if (hari) {
                whereClause.hari = hari;
            }

            if (status) {
                whereClause.status = status;
            }

            const schedules = await MsSchedule.findAll({
                where: whereClause,
            });

            res.status(200).json({ success: true, data: schedules });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error", error });
        }
    }

    static async update(req: any, res: Response): Promise<any> {
        try {
            const { id } = req.params;
            const { hari, jam_awal, jam_akhir, status } = req.body;

            const schedule = await MsSchedule.findByPk(id);
            if (!schedule) {
                return res.status(404).json({ success: false, message: "Schedule not found" });
            }

            await schedule.update({ hari, jam_awal, jam_akhir, status });
            res.status(200).json({ success: true, data: schedule });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error", error });
        }
    }
}

export default MsScheduleController;
