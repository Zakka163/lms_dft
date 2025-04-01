import { Request } from "express";

// Mendeklarasikan interface untuk Request dengan properti tambahan user
export interface RequestWithUser extends Request {
    user: any
}
