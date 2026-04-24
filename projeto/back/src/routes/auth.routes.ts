import { Router } from 'express';
import { body } from 'express-validator';
import authController from '../controllers/auth.controller.js';

const router = Router();

const registerValidators = [
  body('nome').trim().notEmpty().withMessage('Nome é obrigatório.'),
  body('email').isEmail().withMessage('E-mail inválido.').normalizeEmail(),
  body('senha').isLength({ min: 6 }).withMessage('Senha deve ter ao menos 6 caracteres.'),
  body('cpf').isLength({ min: 11, max: 11 }).withMessage('CPF inválido.'),
  body('tipo_usuario')
    .isIn(['PACIENTE', 'PROFISSIONAL', 'ADMIN'])
    .withMessage('Tipo de usuário inválido.'),
  body('especialidade_id')
    .if(body('tipo_usuario').equals('PROFISSIONAL'))
    .notEmpty().withMessage('Especialidade é obrigatória para profissionais.')
    .isInt().withMessage('Especialidade inválida.'),
  body('registro_prof')
    .if(body('tipo_usuario').equals('PROFISSIONAL'))
    .notEmpty().withMessage('Registro profissional é obrigatório.'),
];

const loginValidators = [
  body('email').isEmail().withMessage('E-mail inválido.').normalizeEmail(),
  body('senha').notEmpty().withMessage('Senha é obrigatória.'),
];

router.post('/register', registerValidators, authController.register);
router.post('/login', loginValidators, authController.login);

export default router;