import { Router } from 'express';
import profissionalController from '../controllers/profissional.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/', profissionalController.listar);

export default router;