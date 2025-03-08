import { Router } from "express";
import RouterUser from "./modul/user/route.js";
import RouterAuth from "./modul/auth/route.js";
import RouterMsSchedule from "./modul/ms_schedule/route.js";
import RouterKategori from "./modul/kategori/route.js";
import RouterSubKategori from "./modul/sub_kategori/route.js";
import RouterPoin from "./modul/poin/route.js";
import RouterKelas from "./modul/kelas/route.js";
const router = Router()




router.use('/user',RouterUser)
router.use('/auth',RouterAuth)
router.use('/ms_schedule',RouterMsSchedule)
router.use('/kategori',RouterKategori)
router.use('/sub_kategori',RouterSubKategori)
router.use("/poin", RouterPoin);
router.use("/kelas", RouterKelas);

export default router