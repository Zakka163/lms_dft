import { Router } from "express";
import RouterUser from "./modul/user/route.js";
import RouterAuth from "./modul/auth/route.js";
import RouterMsSchedule from "./modul/ms_schedule/route.js";
const router = Router()




router.use('/user',RouterUser)
router.use('/auth',RouterAuth)
router.use('/ms_schedule',RouterMsSchedule)
export default router