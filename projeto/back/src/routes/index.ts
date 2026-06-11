import { Router } from 'express';
import authRoutes from './auth.routes.js';
import agendaRoutes from './agenda.routes.js';
import profissionalRoutes from './profissional.routes.js';
import consultaRoutes from './consulta.routes.js';
import meRoutes from './me.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/agenda', agendaRoutes);
router.use('/profissionais', profissionalRoutes);
router.use('/consultas', consultaRoutes);
router.use('/me', meRoutes);

export default router;