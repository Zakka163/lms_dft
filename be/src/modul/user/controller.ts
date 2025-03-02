import { Request, Response } from 'express';
import UserService from './service.js';

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
