import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import consultaService from '../services/consulta.service.js';

const consultaController = {
    async solicitar(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            const paciente_id = req.user!.id;
            const { agenda_id, observacoes } = req.body as {
                agenda_id: number;
                observacoes?: string;
            };

            const consulta = await consultaService.solicitar(paciente_id, agenda_id, observacoes);
            return res.status(201).json(consulta);
        } catch (error) {
            next(error);
        }
    },

    async minhasConsultas(req: Request, res: Response, next: NextFunction) {
        try {
            const paciente_id = req.user!.id;
            const consultas = await consultaService.minhasConsultas(paciente_id);
            return res.status(200).json(consultas);
        } catch (error) {
            next(error);
        }
    },

    async solicitacoesProfissional(req: Request, res: Response, next: NextFunction) {
        try {
            const profissional_id = req.user!.id;
            const consultas = await consultaService.solicitacoesProfissional(profissional_id);
            return res.status(200).json(consultas);
        } catch (error) {
            next(error);
        }
    },

    async aprovar(req: Request, res: Response, next: NextFunction) {
        try {
            const profissional_id = req.user!.id;
            const id = Number(req.params['id']);

            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID inválido.' });
            }

            const consulta = await consultaService.aprovar(id, profissional_id);
            return res.status(200).json(consulta);
        } catch (error) {
            next(error);
        }
    },

    async recusar(req: Request, res: Response, next: NextFunction) {
        try {
            const profissional_id = req.user!.id;
            const id = Number(req.params['id']);

            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID inválido.' });
            }

            const consulta = await consultaService.recusar(id, profissional_id);
            return res.status(200).json(consulta);
        } catch (error) {
            next(error);
        }
    },
};

export default consultaController;