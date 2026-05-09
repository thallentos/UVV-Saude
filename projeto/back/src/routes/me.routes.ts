import { Router } from 'express';
import { body } from 'express-validator';
import meController from '../controllers/me.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

const atualizarValidators = [
    body('nome')
        .optional()
        .trim()
        .notEmpty().withMessage('Nome não pode ser vazio.'),
    body('email')
        .optional()
        .isEmail().withMessage('E-mail inválido.')
        .normalizeEmail(),
    body('telefone')
        .optional()
        .isString(),
    body('foto_url')
        .optional()
        .isURL().withMessage('URL de foto inválida.'),
    body('bio')
        .optional()
        .isString(),
];

const senhaValidators = [
    body('senha_atual')
        .notEmpty().withMessage('Senha atual é obrigatória.'),
    body('nova_senha')
        .isLength({ min: 6 }).withMessage('Nova senha deve ter ao menos 6 caracteres.'),
];

router.get('/', meController.buscar);
router.put('/', atualizarValidators, meController.atualizar);
router.put('/senha', senhaValidators, meController.alterarSenha);

export default router;