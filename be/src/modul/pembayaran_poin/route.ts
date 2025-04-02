import { Response, Router, Request } from "express";
import { authMiddleware, authorizationMiddleware } from "../../middleware/authMiddleware.js";
import { createPembayaranPoin } from "./controller.js";
import { RequestWithUser } from "../../helper.ts/model.js";

const PembayaranPoinRouter = Router();

PembayaranPoinRouter.post('/checkout', authMiddleware, (req, res) => createPembayaranPoin(req as RequestWithUser, res))

export default PembayaranPoinRouter;
