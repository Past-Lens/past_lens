import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

type User = {};

// use untyped params to avoid conflicting express type packages across the workspace
export const authenticateLogin = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res
            .status(401)
            .json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token missing' });

    try {
        const secret = process.env.JWT_SECRET!;
        const { user_id } = jwt.verify(token, secret) as {
            [key: string]: string | number;
        };
        //attach userId to request object
        (req as any).userId = user_id;
        next();
    } catch (e) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};
