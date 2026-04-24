import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import type { TipoUsuario } from '../models/models.js';

export interface JwtPayload {
    id: number;
    tipo_usuario: TipoUsuario;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
        return next(new Error('Token não fornecido.'));
    }

    const token = authHeader.split(' ').at(1);
    if (!token) return next(new Error('Token não fornecido.'));
    
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET não configurado.');

        const decoded = jwt.verify(token, secret) as unknown as JwtPayload;
        req.user = decoded;
        next();
    } catch {
        next(new Error('Token inválido ou expirado.'));
    }
}

export function authorize(...roles: TipoUsuario[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.tipo_usuario)) {
            return next(new Error('Acesso não autorizado.'));
        }
        next();
    };
}