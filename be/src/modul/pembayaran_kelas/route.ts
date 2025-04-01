import { Response, Router, Request } from "express";
import { authMiddleware, authorizationMiddleware } from "../../middleware/authMiddleware.js";
import { createPembayaranKelas, createSign, getStatus, handlePaymentNotification } from "./controller.js";
import { RequestWithUser } from "../../helper.ts/model.js";

const PembayaranKelasRouter = Router();

PembayaranKelasRouter.post('/checkout', authMiddleware, (req, res) => createPembayaranKelas(req as RequestWithUser, res))
PembayaranKelasRouter.get("/detail/:id", authMiddleware, getStatus)
PembayaranKelasRouter.post("/payment-notification-handler", handlePaymentNotification);
PembayaranKelasRouter.post("/signature", createSign);

export default PembayaranKelasRouter;
