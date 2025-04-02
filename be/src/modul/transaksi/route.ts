import { Response, Router, Request } from "express";
import { authMiddleware, authorizationMiddleware } from "../../middleware/authMiddleware.js";
import { RequestWithUser } from "../../helper.ts/model.js";
import { getDetailTransaksi, getTransaksi, handlePaymentNotification } from "./controller.js";

const TransaksiRouter = Router();

TransaksiRouter.get('/', authMiddleware, authorizationMiddleware("admin"), (req, res) => getTransaksi(req as RequestWithUser, res))
TransaksiRouter.get('/:id', authMiddleware, authorizationMiddleware("admin"), (req, res) => getDetailTransaksi(req as Request, res))

// callback
TransaksiRouter.post("/payment-notification-handler", handlePaymentNotification);

export default TransaksiRouter;
