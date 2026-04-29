export type TipoUsuario = 'PACIENTE' | 'PROFISSIONAL' | 'ADMIN';
export type StatusVaga = 'LIVRE' | 'OCUPADO';
export type StatusConsulta = 'PENDENTE' | 'CONFIRMADA' | 'RECUSADA' | 'CANCELADA' | 'CONCLUIDA';

export interface Especialidade {
  id: number;
  nome: string;
  descricao: string | null;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  tipo_usuario: TipoUsuario;
  telefone: string | null;
  matricula: string | null;
  foto_url: string | null;
  created_at: Date;
}

export interface Profissional {
  usuario_id: number;
  especialidade_id: number;
  registro_prof: string;
  bio: string | null;
}

export interface Agenda {
  id: number;
  profissional_id: number;
  data_disponivel: Date;
  horario_inicio: string;
  status_vaga: StatusVaga;
}

export interface Consulta {
  id: number;
  paciente_id: number;
  agenda_id: number;
  status_consulta: StatusConsulta;
  observacoes: string | null;
  created_at: Date;
  updated_at: Date;
}