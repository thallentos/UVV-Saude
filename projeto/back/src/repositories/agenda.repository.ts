import db from '../config/database.js';
import type { Agenda } from '../models/models.js';

export interface CreateAgendaDTO {
    profissional_id: number;
    data_disponivel: string;
    horario_inicio: string;
}

const agendaRepository = {
    async create(data: CreateAgendaDTO): Promise<Agenda> {
        const [agenda] = await db<Agenda>('agendas').insert(data).returning('*');
        if (!agenda) throw new Error('Erro ao criar slot de agenda.');
        return agenda;
    },

    async findByProfissional(profissional_id: number): Promise<Agenda[]> {
        return db<Agenda>('agendas')
            .where({ profissional_id })
            .orderBy('data_disponivel', 'asc')
            .orderBy('horario_inicio', 'asc');
    },

    async findById(id: number): Promise<Agenda | undefined> {
        return db<Agenda>('agendas').where({ id }).first();
    },

    async update(id: number, horario_inicio: string): Promise<Agenda> {
        const [agenda] = await db<Agenda>('agendas')
            .where({ id })
            .update({ horario_inicio })
            .returning('*');
        if (!agenda) throw new Error('Erro ao atualizar slot.');
        return agenda;
    },

    async delete(id: number): Promise<void> {
        await db<Agenda>('agendas').where({ id }).delete();
    },

    async existeConflito(
        profissional_id: number,
        data_disponivel: string,
        horario_inicio: string,
        excludeId?: number
    ): Promise<boolean> {
        const query = db<Agenda>('agendas').where({
            profissional_id,
            data_disponivel,
            horario_inicio,
        });
        if (excludeId) query.whereNot({ id: excludeId });
        const slot = await query.first();
        return !!slot;
    },
};

export default agendaRepository;