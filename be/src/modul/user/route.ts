import { Response, Router, Request } from "express";
import { controllerGetUserById, controllerGetUsers } from "./controller.js";
import { authMiddleware, authorizationMiddleware } from "../../middleware/authMiddleware.js";

const RouterUser = Router();
RouterUser.get('/list', authMiddleware, authorizationMiddleware("admin"), controllerGetUsers);
RouterUser.get('/user/:id', authMiddleware, controllerGetUserById)


export default RouterUser;
