import express from "express";
import { getAllPoin, getPoinById, createPoin, updatePoin, deletePoin } from "./controller.js";

const router = express.Router();

router.get("/", getAllPoin);
router.get("/:id", getPoinById);
router.post("/", createPoin);
router.put("/:id", updatePoin);
router.delete("/:id", deletePoin);

export default router;
