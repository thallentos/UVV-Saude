import type { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
    statusCode?: number;
}

export function errorHandler(err: AppError, req: Request, res: Response, next: NextFunction) {
    const status = err.statusCode ?? 500;

    if ('code' in err && (err as NodeJS.ErrnoException).code === '23505') {
        return res.status(409).json({ message: 'Registro duplicado.' });
    }

    console.error('[ERROR]', err.message);

    return res.status(status).json({
        message: process.env.NODE_ENV === 'production' ? 'Erro interno no servidor.' : err.message,
    });
}