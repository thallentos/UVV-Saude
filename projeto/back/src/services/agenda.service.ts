import agendaRepository from '../repositories/agenda.repository.js';
import type { Agenda } from '../models/models.js';

const agendaService = {
    async criar(profissional_id: number, data_disponivel: string, horario_inicio: string): Promise<Agenda> {
        const conflito = await agendaRepository.existeConflito(
            profissional_id,
            data_disponivel,
            horario_inicio
        );
        if (conflito) {
            const err = Object.assign(new Error('Já existe um slot nesse horário.'), { statusCode: 409 });
            throw err;
        }

        return agendaRepository.create({ profissional_id, data_disponivel, horario_inicio });
    },

    async listarMinhaAgenda(profissional_id: number): Promise<Agenda[]> {
        return agendaRepository.findByProfissional(profissional_id);
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

        if (slot.status_vaga === 'OCUPADO') {
            const err = Object.assign(new Error('Não é possível deletar um slot já ocupado.'), { statusCode: 400 });
            throw err;
        }

        await agendaRepository.delete(id);
    },
};

export default agendaService;