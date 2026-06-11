import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import agendaService from '../services/agenda.service.js';

const agendaController = {
    async criar(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const profissional_id = req.user!.id;
            const { data_disponivel, horario_inicio } = req.body as {
                data_disponivel: string;
                horario_inicio: string;
            };
            const agenda = await agendaService.criar(profissional_id, data_disponivel, horario_inicio);
            return res.status(201).json(agenda);
        } catch (error) {
            next(error);
        }
    },

    async listarMinha(req: Request, res: Response, next: NextFunction) {
        try {
            const profissional_id = req.user!.id;
            const agenda = await agendaService.listarMinhaAgenda(profissional_id);
            return res.status(200).json(agenda);
        } catch (error) {
            next(error);
        }
    },

    async listarPorProfissional(req: Request, res: Response, next: NextFunction) {
        try {
            const profissional_id = Number(req.params['profissional_id']);
            if (isNaN(profissional_id)) {
                return res.status(400).json({ message: 'ID inválido.' });
            }
            const agenda = await agendaService.listarAgendaLivre(profissional_id);
            return res.status(200).json(agenda);
        } catch (error) {
            next(error);
        }
    },

    async editar(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }
            const profissional_id = req.user!.id;
            const id = Number(req.params['id']);
            const { horario_inicio } = req.body as { horario_inicio: string };
            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID inválido.' });
            }
            const agenda = await agendaService.editar(id, profissional_id, horario_inicio);
            return res.status(200).json(agenda);
        } catch (error) {
            next(error);
        }
    },

    async deletar(req: Request, res: Response, next: NextFunction) {
        try {
            const profissional_id = req.user!.id;
            const id = Number(req.params['id']);
            if (isNaN(id)) {
                return res.status(400).json({ message: 'ID inválido.' });
            }
            await agendaService.deletar(id, profissional_id);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    },
};

export default agendaController;