import consultaRepository, { type ConsultaCompleta } from '../repositories/consulta.repository.js';
import agendaRepository from '../repositories/agenda.repository.js';
import type { Consulta } from '../models/models.js';

const consultaService = {
    async solicitar(paciente_id: number, agenda_id: number, observacoes?: string): Promise<Consulta> {
        const slot = await agendaRepository.findById(agenda_id);

        if (!slot) {
            const err = Object.assign(new Error('Horário não encontrado.'), { statusCode: 404 });
            throw err;
        }

        if (slot.status_vaga === 'OCUPADO') {
            const err = Object.assign(new Error('Este horário já está ocupado.'), { statusCode: 409 });
            throw err;
        }

        const consulta = await consultaRepository.create({ paciente_id, agenda_id, observacoes });

        await agendaRepository.update(agenda_id, slot.horario_inicio);
        await markSlotOcupado(agenda_id);

        return consulta;
    },

    async minhasConsultas(paciente_id: number): Promise<ConsultaCompleta[]> {
        return consultaRepository.findByPaciente(paciente_id);
    },

    async solicitacoesProfissional(profissional_id: number): Promise<ConsultaCompleta[]> {
        return consultaRepository.findSolicitacoesByProfissional(profissional_id);
    },

    async aprovar(id: number, profissional_id: number): Promise<Consulta> {
        const consulta = await consultaRepository.findById(id);

        if (!consulta) {
            const err = Object.assign(new Error('Consulta não encontrada.'), { statusCode: 404 });
            throw err;
        }

        const slot = await agendaRepository.findById(consulta.agenda_id);

        if (!slot || slot.profissional_id !== profissional_id) {
            const err = Object.assign(new Error('Sem permissão para aprovar esta consulta.'), { statusCode: 403 });
            throw err;
        }

        if (consulta.status_consulta !== 'PENDENTE') {
            const err = Object.assign(new Error('Apenas consultas pendentes podem ser aprovadas.'), { statusCode: 400 });
            throw err;
        }

        return consultaRepository.updateStatus(id, 'CONFIRMADA');
    },

    async recusar(id: number, profissional_id: number): Promise<Consulta> {
        const consulta = await consultaRepository.findById(id);

        if (!consulta) {
            const err = Object.assign(new Error('Consulta não encontrada.'), { statusCode: 404 });
            throw err;
        }

        const slot = await agendaRepository.findById(consulta.agenda_id);

        if (!slot || slot.profissional_id !== profissional_id) {
            const err = Object.assign(new Error('Sem permissão para recusar esta consulta.'), { statusCode: 403 });
            throw err;
        }

        if (consulta.status_consulta !== 'PENDENTE') {
            const err = Object.assign(new Error('Apenas consultas pendentes podem ser recusadas.'), { statusCode: 400 });
            throw err;
        }

        await markSlotLivre(consulta.agenda_id);
        return consultaRepository.updateStatus(id, 'RECUSADA');
    },
};

async function markSlotOcupado(agenda_id: number): Promise<void> {
    await import('../config/database.js').then(({ default: db }) =>
        db('agendas').where({ id: agenda_id }).update({ status_vaga: 'OCUPADO' })
    );
}

async function markSlotLivre(agenda_id: number): Promise<void> {
    await import('../config/database.js').then(({ default: db }) =>
        db('agendas').where({ id: agenda_id }).update({ status_vaga: 'LIVRE' })
    );
}

export default consultaService;