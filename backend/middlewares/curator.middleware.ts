import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types/express';

export const curatorMiddleware = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        if (user.role !== 'curator' && user.role !== 'admin') {
            return res
                .status(403)
                .json({ error: 'Curator or admin access required' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};
