import { Response, Router, Request } from "express";
import { controllerGetUsers } from "./controller.js";
import { authMiddleware, authorizationMiddleware } from "../../middleware/authMiddleware.js";

const RouterUser = Router();
RouterUser.get('/list', authMiddleware, authorizationMiddleware("admin"), controllerGetUsers);


export default RouterUser;
