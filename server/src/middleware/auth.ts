import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

interface AuthRequest extends Request {
    user?: {userId: number};
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).json({error: "No token provided"});
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, JWT_SECRET) as {userId: number};
        req.user = decoded;
        next();
    } catch {
        return res.status(400).json({error: "Invalid token"});
    }
}