import agendaRepository from '../repositories/agenda.repository.js';
import type { Agenda } from '../models/models.js';

const agendaService = {
    async criar(profissional_id: number, data_disponivel: string, horario_inicio: string): Promise<Agenda> {
        const conflito = await agendaRepository.existeConflito(profissional_id, data_disponivel, horario_inicio);
        if (conflito) {
            const err = Object.assign(new Error('Já existe um slot nesse horário.'), { statusCode: 409 });
            throw err;
        }
        return agendaRepository.create({ profissional_id, data_disponivel, horario_inicio });
    },

    async listarMinhaAgenda(profissional_id: number): Promise<Agenda[]> {
        return agendaRepository.findByProfissional(profissional_id);
    },

    async listarAgendaLivre(profissional_id: number): Promise<Agenda[]> {
        return agendaRepository.findLivreByProfissional(profissional_id);
    },

    async editar(id: number, profissional_id: number, horario_inicio: string): Promise<Agenda> {
        const slot = await agendaRepository.findById(id);
        if (!slot) {
            const err = Object.assign(new Error('Slot não encontrado.'), { statusCode: 404 });
            throw err;
        }
        if (slot.profissional_id !== profissional_id) {
            const err = Object.assign(new Error('Sem permissão para editar este slot.'), { statusCode: 403 });
            throw err;
        }

        // Garante formato YYYY-MM-DD independente do que o pg retornar
        const dataFormatada = slot.data_disponivel instanceof Date
            ? slot.data_disponivel.toISOString().split('T')[0]
            : String(slot.data_disponivel).split('T')[0];

        const conflito = await agendaRepository.existeConflito(
            profissional_id,
            dataFormatada,
            horario_inicio,
            id
        );
        if (conflito) {
            const err = Object.assign(new Error('Já existe um slot nesse horário.'), { statusCode: 409 });
            throw err;
        }
        return agendaRepository.update(id, horario_inicio);
    },

    async deletar(id: number, profissional_id: number): Promise<void> {
        const slot = await agendaRepository.findById(id);
        if (!slot) {
            const err = Object.assign(new Error('Slot não encontrado.'), { statusCode: 404 });
            throw err;
        }
        if (slot.profissional_id !== profissional_id) {
            const err = Object.assign(new Error('Sem permissão para deletar este slot.'), { statusCode: 403 });
            throw err;
        }
        await agendaRepository.delete(id);
    },
};

export default agendaService;