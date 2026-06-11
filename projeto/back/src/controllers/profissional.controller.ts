import type { Request, Response, NextFunction } from 'express';
import profissionalService from '../services/profissional.service.js';

const profissionalController = {
    async listar(req: Request, res: Response, next: NextFunction) {
        try {
            const especialidade_id = req.query['especialidade_id']
                ? Number(req.query['especialidade_id'])
                : undefined;

            const profissionais = await profissionalService.listar(especialidade_id);
            return res.status(200).json(profissionais);
        } catch (error) {
            next(error);
        }
    },
};

export default profissionalController;