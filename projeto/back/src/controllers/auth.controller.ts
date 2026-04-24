import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import authService from '../services/auth.service.js';

const authController = {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            const result = await authService.register(req.body);
            return res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            const result = await authService.login(req.body);
            return res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    },
};

export default authController;