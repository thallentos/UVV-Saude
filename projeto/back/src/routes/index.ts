import { Router } from 'express';
import authRoutes from './auth.routes.js';
import agendaRoutes from './agenda.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/agenda', agendaRoutes);

export default router;