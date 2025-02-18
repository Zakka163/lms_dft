import { Response, Router, Request } from "express";
import MsScheduleController  from "./controller.js";
import { authMiddleware, authorizationMiddleware } from "../../middleware/authMiddleware.js";

const RouterMsSchedule = Router();
RouterMsSchedule.get('/list', authMiddleware, authorizationMiddleware("admin"), MsScheduleController.getAll);
RouterMsSchedule.post('/update/:id', authMiddleware, authorizationMiddleware("admin"), MsScheduleController.update);

export default RouterMsSchedule;
