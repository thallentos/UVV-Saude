import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import db from '../config/database.js';
import usuarioRepository from '../repositories/usuario.repository.js';
import profissionalRepository from '../repositories/profissional.repository.js';
import type { TipoUsuario } from '../models/models.js';

const SALT_ROUNDS = 10;

interface RegisterDTO {
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  tipo_usuario: TipoUsuario;
  telefone?: string;
  matricula?: string;
  especialidade_id?: number;
  registro_prof?: string;
  bio?: string;
}

interface LoginDTO {
  email: string;
  senha: string;
}

function generateToken(payload: { id: number; tipo_usuario: TipoUsuario }) {
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? '7d') as NonNullable<SignOptions['expiresIn']>;
  return jwt.sign(payload, process.env.JWT_SECRET ?? '', { expiresIn });
}

const authService = {
  async register(data: RegisterDTO) {
    const existing = await usuarioRepository.findByEmail(data.email);
    if (existing) throw new Error('E-mail já cadastrado.');

    if (data.tipo_usuario === 'PROFISSIONAL') {
      if (!data.especialidade_id || !data.registro_prof) {
        throw new Error('Especialidade e registro profissional são obrigatórios.');
      }
    }

    const senhaHash = await bcrypt.hash(data.senha, SALT_ROUNDS);

    // separa os campos de profissional antes de inserir em usuarios
    const { especialidade_id, registro_prof, bio, ...dadosUsuario } = data;

    const usuario = await db.transaction(async (trx) => {
      const novoUsuario = await usuarioRepository.create(
        { ...dadosUsuario, senha: senhaHash },
        trx,
      );

      if (data.tipo_usuario === 'PROFISSIONAL') {
        await profissionalRepository.create(
          {
            usuario_id: novoUsuario.id,
            especialidade_id: especialidade_id!,
            registro_prof: registro_prof!,
            ...(bio && { bio }),
          },
          trx,
        );
      }

      return novoUsuario;
    });

    const token = generateToken({ id: usuario.id, tipo_usuario: usuario.tipo_usuario });

    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
      },
      token,
    };
  },

  async login(data: LoginDTO) {
    const usuario = await usuarioRepository.findByEmail(data.email);
    if (!usuario) throw new Error('Credenciais inválidas.');

    const senhaValida = await bcrypt.compare(data.senha, usuario.senha);
    if (!senhaValida) throw new Error('Credenciais inválidas.');

    const token = generateToken({ id: usuario.id, tipo_usuario: usuario.tipo_usuario });

    return {
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
      },
      token,
    };
  },
};

export default authService;