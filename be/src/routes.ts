import { Router } from "express";
import RouterUser from "./modul/user/route.js";
import RouterAuth from "./modul/auth/route.js";
const router = Router()




router.use('/user',RouterUser)
router.use('/auth',RouterAuth)

export default router