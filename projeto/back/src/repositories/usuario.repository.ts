import db from '../config/database.js';
import type { Knex } from 'knex';
import type { Usuario, TipoUsuario } from '../models/models.js';

export interface CreateUsuarioDTO {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
    tipo_usuario: TipoUsuario;
    telefone?: string;
    matricula?: string;
}

export interface UpdateUsuarioDTO {
    nome?: string;
    email?: string;
    telefone?: string;
    foto_url?: string;
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

    async update(id: number, data: UpdateUsuarioDTO): Promise<Omit<Usuario, 'senha'>> {
        const [usuario] = await db<Usuario>('usuarios')
            .where({ id })
            .update(data)
            .returning(['id', 'nome', 'email', 'cpf', 'tipo_usuario', 'telefone', 'matricula', 'foto_url', 'created_at']);
        if (!usuario) throw new Error('Erro ao atualizar usuário.');
        return usuario;
    },

    async updateSenha(id: number, senha: string): Promise<void> {
        await db<Usuario>('usuarios').where({ id }).update({ senha });
    },

    async findByEmailExcluindo(email: string, excludeId: number): Promise<Usuario | undefined> {
        return db<Usuario>('usuarios')
            .where({ email })
            .whereNot({ id: excludeId })
            .first();
    },
};

export default usuarioRepository;