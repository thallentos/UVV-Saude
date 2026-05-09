import profissionalRepository, { type ProfissionalCompleto } from '../repositories/profissional.repository.js';

const profissionalService = {
    async listar(especialidade_id?: number): Promise<ProfissionalCompleto[]> {
        return profissionalRepository.listarTodos(especialidade_id);
    },
};

export default profissionalService;