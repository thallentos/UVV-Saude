import { Router } from 'express';
import { body } from 'express-validator';
import agendaController from '../controllers/agenda.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

const criarAgendaValidators = [
    body('data_disponivel')
        .notEmpty().withMessage('Data é obrigatória.')
        .isDate().withMessage('Data inválida. Use o formato YYYY-MM-DD.'),
    body('horario_inicio')
        .notEmpty().withMessage('Horário é obrigatório.')
        .matches(/^([0-1]\d|2[0-3]):[0-5]\d$/).withMessage('Horário inválido. Use o formato HH:MM.'),
];

router.use(authenticate);
router.use(authorize('PROFISSIONAL'));

router.post('/', criarAgendaValidators, agendaController.criar);
router.get('/minha', agendaController.listarMinha);
router.delete('/:id', agendaController.deletar);

export default router;