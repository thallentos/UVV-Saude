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

const editarAgendaValidators = [
    body('horario_inicio')
        .notEmpty().withMessage('Horário é obrigatório.')
        .matches(/^([0-1]\d|2[0-3]):[0-5]\d$/).withMessage('Horário inválido. Use o formato HH:MM.'),
];

// Rota pública para o paciente ver a agenda de um profissional
router.get(
    '/profissional/:profissional_id',
    authenticate,
    agendaController.listarPorProfissional
);

// Rotas exclusivas do profissional
router.post('/', authenticate, authorize('PROFISSIONAL'), criarAgendaValidators, agendaController.criar);
router.get('/minha', authenticate, authorize('PROFISSIONAL'), agendaController.listarMinha);
router.put('/:id', authenticate, authorize('PROFISSIONAL'), editarAgendaValidators, agendaController.editar);
router.delete('/:id', authenticate, authorize('PROFISSIONAL'), agendaController.deletar);

export default router;