import { Response, Router, Request } from "express";
import { authMiddleware, authorizationMiddleware } from "../../middleware/authMiddleware.js";
import { createPembayaranKelas } from "./controller.js";
import { RequestWithUser } from "../../helper.ts/model.js";

const PembayaranKelasRouter = Router();

PembayaranKelasRouter.post('/checkout', authMiddleware, (req, res) => createPembayaranKelas(req as RequestWithUser, res))


export default PembayaranKelasRouter;
