import db from '../config/database.js';
import type { Knex } from 'knex';
import type { Usuario, TipoUsuario } from '../models/models.ts';

export interface CreateUsuarioDTO {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    tipo_usuario: TipoUsuario;
    telefone?: string;
    matricula?: string;
}

const usuarioRepository = {
    async findByEmail(email: string): Promise<Usuario | undefined> {
        return db<Usuario>('usuarios').where({ email }).first();
    },

    async findById(id: number): Promise<Omit<Usuario, 'senha'> | undefined> {
        return db<Usuario>('usuarios')
            .where({ id })
            .select('id', 'nome', 'email', 'cpf', 'tipo_usuario', 'telefone', 'matricula', 'foto_url', 'created_at')
            .first();
    },

    async create(data: CreateUsuarioDTO, trx?: Knex.Transaction): Promise<Usuario> {
        const conn = trx ?? db;
        const [usuario] = await conn<Usuario>('usuarios').insert(data).returning('*');

        if (!usuario) throw new Error('Erro ao criar usuário.');
        return usuario;
    },
};

export default usuarioRepository;