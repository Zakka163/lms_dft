import { Router } from "express";
import RouterUser from "./modul/user/route.js";
const router = Router()




router.use('/user',RouterUser)

export default router