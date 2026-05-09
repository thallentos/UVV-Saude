import { Router } from 'express';
import { body } from 'express-validator';
import consultaController from '../controllers/consulta.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

const solicitarValidators = [
    body('agenda_id')
        .notEmpty().withMessage('Horário é obrigatório.')
        .isInt().withMessage('Horário inválido.'),
    body('observacoes')
        .optional()
        .isString().withMessage('Observações inválidas.'),
];

// Rotas do paciente
router.post(
    '/',
    authenticate,
    authorize('PACIENTE'),
    solicitarValidators,
    consultaController.solicitar
);

router.get(
    '/minhas',
    authenticate,
    authorize('PACIENTE'),
    consultaController.minhasConsultas
);

// Rotas do profissional
router.get(
    '/solicitacoes',
    authenticate,
    authorize('PROFISSIONAL'),
    consultaController.solicitacoesProfissional
);

router.put(
    '/:id/aprovar',
    authenticate,
    authorize('PROFISSIONAL'),
    consultaController.aprovar
);

router.put(
    '/:id/recusar',
    authenticate,
    authorize('PROFISSIONAL'),
    consultaController.recusar
);

export default router;