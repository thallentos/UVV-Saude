import bcrypt from 'bcryptjs';
import usuarioRepository, { type UpdateUsuarioDTO } from '../repositories/usuario.repository.js';
import profissionalRepository, { type UpdateProfissionalDTO } from '../repositories/profissional.repository.js';
import type { TipoUsuario } from '../models/models.js';

interface MeResponse {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    tipo_usuario: TipoUsuario;
    telefone: string | null;
    matricula: string | null;
    foto_url: string | null;
    created_at: Date;
    bio?: string | null;
    registro_prof?: string | null;
    especialidade_id?: number | null;
    especialidade_nome?: string | null;
}

interface UpdateMeDTO {
    nome?: string;
    email?: string;
    telefone?: string;
    foto_url?: string;
    bio?: string;
}

const meService = {
    async buscar(id: number, tipo_usuario: TipoUsuario): Promise<MeResponse> {
        const usuario = await usuarioRepository.findById(id);
        if (!usuario) {
            const err = Object.assign(new Error('Usuário não encontrado.'), { statusCode: 404 });
            throw err;
        }

        if (tipo_usuario === 'PROFISSIONAL') {
            const profissional = await profissionalRepository.findByUsuarioId(id);
            const dadosProf = await profissionalRepository.listarTodos().then(
                list => list.find(p => p.usuario_id === id)
            );
            return {
                ...usuario,
                bio: profissional?.bio ?? null,
                registro_prof: profissional?.registro_prof ?? null,
                especialidade_id: profissional?.especialidade_id ?? null,
                especialidade_nome: dadosProf?.especialidade_nome ?? null,
            };
        }

        return usuario;
    },

    async atualizar(id: number, tipo_usuario: TipoUsuario, data: UpdateMeDTO): Promise<MeResponse> {
        if (data.email) {
            const emailExistente = await usuarioRepository.findByEmailExcluindo(data.email, id);
            if (emailExistente) {
                const err = Object.assign(new Error('Este e-mail já está em uso.'), { statusCode: 409 });
                throw err;
            }
        }

        const dadosUsuario: UpdateUsuarioDTO = {};
        if (data.nome) dadosUsuario.nome = data.nome;
        if (data.email) dadosUsuario.email = data.email;
        if (data.telefone !== undefined) dadosUsuario.telefone = data.telefone;
        if (data.foto_url !== undefined) dadosUsuario.foto_url = data.foto_url;

        const usuario = await usuarioRepository.update(id, dadosUsuario);

        if (tipo_usuario === 'PROFISSIONAL' && data.bio !== undefined) {
            const dadosProf: UpdateProfissionalDTO = { bio: data.bio };
            await profissionalRepository.update(id, dadosProf);
        }

        return meService.buscar(id, tipo_usuario);
    },

    async alterarSenha(id: number, senhaAtual: string, novaSenha: string): Promise<void> {
        const usuario = await usuarioRepository.findByEmail(
            (await usuarioRepository.findById(id))!.email
        );

        if (!usuario) {
            const err = Object.assign(new Error('Usuário não encontrado.'), { statusCode: 404 });
            throw err;
        }

        const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
        if (!senhaValida) {
            const err = Object.assign(new Error('Senha atual incorreta.'), { statusCode: 400 });
            throw err;
        }

        const novaHash = await bcrypt.hash(novaSenha, 10);
        await usuarioRepository.updateSenha(id, novaHash);
    },
};

export default meService;