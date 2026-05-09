import type { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import meService from '../services/me.service.js';

const meController = {
    async buscar(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, tipo_usuario } = req.user!;
            const dados = await meService.buscar(id, tipo_usuario);
            return res.status(200).json(dados);
        } catch (error) {
            next(error);
        }
    },

    async atualizar(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            const { id, tipo_usuario } = req.user!;
            const dados = await meService.atualizar(id, tipo_usuario, req.body);
            return res.status(200).json(dados);
        } catch (error) {
            next(error);
        }
    },

    async alterarSenha(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(422).json({ errors: errors.array() });
            }

            const { id } = req.user!;
            const { senha_atual, nova_senha } = req.body as {
                senha_atual: string;
                nova_senha: string;
            };

            await meService.alterarSenha(id, senha_atual, nova_senha);
            return res.status(200).json({ message: 'Senha alterada com sucesso.' });
        } catch (error) {
            next(error);
        }
    },
};

export default meController;