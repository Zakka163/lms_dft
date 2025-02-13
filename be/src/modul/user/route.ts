import { Response, Router,Request } from "express";
import { controllerGetUsers } from "./controller.js";
const RouterUser = Router()

RouterUser.get('/list',controllerGetUsers)



export default RouterUser