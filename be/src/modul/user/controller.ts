import { Request, Response } from 'express';
import  { getAllSiswa, UserService } from './service.js';

export const controllerGetUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const filters = req.query;
        const users = await UserService.getAllUsers(filters);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error: error instanceof Error ? error.message : error });
    }
};

export const controllerGetUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }

        const userId = parseInt(id, 10);
        if (isNaN(userId)) {
            res.status(400).json({ message: "Invalid User ID" });
            return;
        }

        const user = await UserService.getUserById(userId);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.json({ data: user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error: error instanceof Error ? error.message : error });
    }
};
export const controllerGetSiswa = async (req: Request, res: Response): Promise<any> => {
    try {
        const { page = "1", limit = "10", ...filters } = req.query;

        const pageNumber = parseInt(page as string, 10);
        const limitNumber = parseInt(limit as string, 10);

        if (isNaN(pageNumber) || isNaN(limitNumber) || pageNumber < 1 || limitNumber < 1) {
            res.status(400).json({ success: false, message: "Invalid page or limit parameter" });
            return;
        }

        const { data, totalData } = await getAllSiswa(filters, pageNumber, limitNumber);
        const totalPages = Math.ceil(totalData / limitNumber);
        res.json({
            success: true,
            data,
            pagination: {
                currentPage: pageNumber,
                totalPages,
                totalData,
                limit: limitNumber,
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error: error instanceof Error ? error.message : error
        });
    }
};


