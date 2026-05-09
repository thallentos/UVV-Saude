import db from '../config/database.js';
import type { Consulta } from '../models/models.js';

export interface CreateConsultaDTO {
    paciente_id: number;
    agenda_id: number;
    observacoes?: string;
}

export interface ConsultaCompleta {
    id: number;
    paciente_id: number;
    paciente_nome: string;
    paciente_email: string;
    agenda_id: number;
    data_disponivel: string;
    horario_inicio: string;
    profissional_id: number;
    profissional_nome: string;
    especialidade_nome: string;
    status_consulta: string;
    observacoes: string | null;
    created_at: Date;
    updated_at: Date;
}

const consultaRepository = {
    async create(data: CreateConsultaDTO): Promise<Consulta> {
        const [consulta] = await db<Consulta>('consultas')
            .insert({
                ...data,
                status_consulta: 'PENDENTE',
                created_at: new Date(),
                updated_at: new Date(),
            })
            .returning('*');
        if (!consulta) throw new Error('Erro ao criar consulta.');
        return consulta;
    },

    async findById(id: number): Promise<Consulta | undefined> {
        return db<Consulta>('consultas').where({ id }).first();
    },

    async findByPaciente(paciente_id: number): Promise<ConsultaCompleta[]> {
        return db('consultas')
            .join('agendas', 'consultas.agenda_id', 'agendas.id')
            .join('usuarios as paciente', 'consultas.paciente_id', 'paciente.id')
            .join('usuarios as profissional', 'agendas.profissional_id', 'profissional.id')
            .join('profissionais', 'agendas.profissional_id', 'profissionais.usuario_id')
            .join('especialidades', 'profissionais.especialidade_id', 'especialidades.id')
            .where('consultas.paciente_id', paciente_id)
            .select(
                'consultas.id',
                'consultas.paciente_id',
                'paciente.nome as paciente_nome',
                'paciente.email as paciente_email',
                'consultas.agenda_id',
                'agendas.data_disponivel',
                'agendas.horario_inicio',
                'agendas.profissional_id',
                'profissional.nome as profissional_nome',
                'especialidades.nome as especialidade_nome',
                'consultas.status_consulta',
                'consultas.observacoes',
                'consultas.created_at',
                'consultas.updated_at'
            )
            .orderBy('agendas.data_disponivel', 'desc')
            .orderBy('agendas.horario_inicio', 'desc');
    },

    async findSolicitacoesByProfissional(profissional_id: number): Promise<ConsultaCompleta[]> {
        return db('consultas')
            .join('agendas', 'consultas.agenda_id', 'agendas.id')
            .join('usuarios as paciente', 'consultas.paciente_id', 'paciente.id')
            .join('usuarios as profissional', 'agendas.profissional_id', 'profissional.id')
            .join('profissionais', 'agendas.profissional_id', 'profissionais.usuario_id')
            .join('especialidades', 'profissionais.especialidade_id', 'especialidades.id')
            .where('agendas.profissional_id', profissional_id)
            .select(
                'consultas.id',
                'consultas.paciente_id',
                'paciente.nome as paciente_nome',
                'paciente.email as paciente_email',
                'consultas.agenda_id',
                'agendas.data_disponivel',
                'agendas.horario_inicio',
                'agendas.profissional_id',
                'profissional.nome as profissional_nome',
                'especialidades.nome as especialidade_nome',
                'consultas.status_consulta',
                'consultas.observacoes',
                'consultas.created_at',
                'consultas.updated_at'
            )
            .orderBy('agendas.data_disponivel', 'asc')
            .orderBy('agendas.horario_inicio', 'asc');
    },

    async updateStatus(id: number, status_consulta: string): Promise<Consulta> {
        const [consulta] = await db<Consulta>('consultas')
            .where({ id })
            .update({ status_consulta, updated_at: new Date() })
            .returning('*');
        if (!consulta) throw new Error('Erro ao atualizar consulta.');
        return consulta;
    },
};

export default consultaRepository;