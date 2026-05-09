import db from '../config/database.js';
import type { Profissional } from '../models/models.js';

export interface CreateProfissionalDTO {
    usuario_id: number;
    especialidade_id: number;
    registro_prof: string;
    bio?: string;
}

export interface ProfissionalCompleto {
    usuario_id: number;
    nome: string;
    email: string;
    telefone: string | null;
    foto_url: string | null;
    especialidade_id: number;
    especialidade_nome: string;
    registro_prof: string;
    bio: string | null;
}

const profissionalRepository = {
    async findByUsuarioId(usuario_id: number): Promise<Profissional | undefined> {
        return db<Profissional>('profissionais').where({ usuario_id }).first();
    },

    async create(data: CreateProfissionalDTO, trx?: import('knex').Knex.Transaction): Promise<Profissional> {
        const conn = trx ?? db;
        const [profissional] = await conn<Profissional>('profissionais').insert(data).returning('*');
        if (!profissional) throw new Error('Erro ao criar profissional.');
        return profissional;
    },

    async listarTodos(especialidade_id?: number): Promise<ProfissionalCompleto[]> {
        const query = db('profissionais')
            .join('usuarios', 'profissionais.usuario_id', 'usuarios.id')
            .join('especialidades', 'profissionais.especialidade_id', 'especialidades.id')
            .select(
                'profissionais.usuario_id',
                'usuarios.nome',
                'usuarios.email',
                'usuarios.telefone',
                'usuarios.foto_url',
                'profissionais.especialidade_id',
                'especialidades.nome as especialidade_nome',
                'profissionais.registro_prof',
                'profissionais.bio'
            );

        if (especialidade_id) {
            query.where('profissionais.especialidade_id', especialidade_id);
        }

        return query;
    },
};

export default profissionalRepository;