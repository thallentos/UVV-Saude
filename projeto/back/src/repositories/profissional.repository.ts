import db from '../config/database.js';
import type { Knex } from 'knex';
import type { Profissional } from '../models/models.ts';

export interface CreateProfissionalDTO {
    usuario_id: number;
    especialidade_id: number;
    registro_prof: string;
    bio?: string;
}

const profissionalRepository = {
    async findByUsuarioId(usuario_id: number): Promise<Profissional | undefined> {
        return db<Profissional>('profissionais').where({ usuario_id }).first();
    },

    async create(data: CreateProfissionalDTO, trx?: Knex.Transaction): Promise<Profissional> {
        const conn = trx ?? db;
        const [profissional] = await conn<Profissional>('profissionais').insert(data).returning('*');

        if (!profissional) throw new Error('Erro ao criar profissional.');
        return profissional;
    },
};

export default profissionalRepository;