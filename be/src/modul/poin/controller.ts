import { Request, Response } from "express";
import Poin from "./model.js";
import { Op } from "sequelize";

// Get All Poin with Pagination
export const getAllPoin = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const search = req.query.search ? (req.query.search as string) : "";

        const { count, rows } = await Poin.findAndCountAll({
            where: search ? { nama_poin: { [Op.like]: `%${search}%` } } : {},
            limit,
            offset,
        });

        res.status(200).json({
            success: true,
            data: rows,
            totalItems: count,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

// Get Poin By ID
export const getPoinById = async (req: Request, res: Response): Promise<any> => {
    try {
        const poin = await Poin.findByPk(req.params.id);
        if (!poin) return res.status(404).json({ success: false, message: "Poin not found" });
        res.status(200).json({ success: true, data: poin });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

// Create Poin
export const createPoin = async (req: Request, res: Response): Promise<any> => {
    try {
        const newPoin = await Poin.create(req.body);
        res.status(201).json({ success: true, data: newPoin });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

// Update Poin: Promise<any>
export const updatePoin = async (req: Request, res: Response): Promise<any> => {
    try {
        const poin = await Poin.findByPk(req.params.id);
        if (!poin) return res.status(404).json({ success: false, message: "Poin not found" });

        await poin.update(req.body);
        res.status(200).json({ success: true, data: poin });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

// Delete Poin (Soft Delete)
export const deletePoin = async (req: Request, res: Response): Promise<any> => {
    try {
        const poin = await Poin.findByPk(req.params.id);
        if (!poin) return res.status(404).json({ success: false, message: "Poin not found" });

        await poin.destroy();
        res.status(200).json({ success: true, message: "Poin deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};
