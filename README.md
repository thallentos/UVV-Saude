# UVV Saúde — API

API de agendamento de serviços de saúde (nutrição e psicologia) da Universidade Vila Velha.

## Pré-requisitos

1. passo instalar/baixar o postgresql e Dbeaver (https://www.youtube.com/watch?v=PEDGqGq4bb8&t=1s)
2. passo conectar ambos
3. passo instalar node
4. passo instalar express

## Stack

- **Runtime:** Node.js
- **Linguagem:** TypeScript
- **Framework:** Express
- **Banco de dados:** PostgreSQL
- **Query Builder:** Knex
- **Autenticação:** JWT + bcrypt

## Arquitetura

```
src/
├── config/
│   └── database.ts          # Instância do Knex (singleton)
├── models/
│   └── models.ts            # Tipos TypeScript espelhando o banco
├── controllers/             # Recebe req/res, chama o serviço
├── services/                # Regras de negócio e transações
├── repositories/            # Queries ao banco (DAO)
├── routes/                  # Endpoints e validações
├── middlewares/             # Autenticação JWT e tratamento de erros
├── app.ts                   # Configuração do Express
└── server.ts                # Entrada da aplicação
```

Fluxo de uma feature:
```
Route → Controller → Service → Repository → Knex → PostgreSQL
```

## Como rodar?

### 1. Instale as dependências

```bash
npm install
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com as suas configurações:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=saude_agendamento

JWT_SECRET=troque_por_um_segredo_forte_aqui
JWT_EXPIRES_IN=7d
```

### 3. Inicie o servidor

```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`.

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia com hot reload (tsx watch) |
| `npm run build` | Compila o TypeScript para `dist/` |
| `npm run start` | Inicia em produção a partir do `dist/` |

## Endpoints

### Health check

| Método | Rota | Descrição |
|---|---|---|
| GET | `/health` | Verifica se o servidor está rodando |

### Auth

| Método | Rota | Descrição |
|---|---|---|---|
| POST | `/api/v1/auth/register` | Cadastro de usuário |
| POST | `/api/v1/auth/login` | Login |

## Exemplos de requisição

### Cadastro de paciente

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@gmail.com",
  "senha": "123456",
  "cpf": "12345678901",
  "tipo_usuario": "PACIENTE",
  "telefone": "27999990000",
  "matricula": "M01"
}
```

### Cadastro de profissional

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "nome": "Caique Amaral",
  "email": "caique@uvv.br",
  "senha": "123456",
  "cpf": "98765432100",
  "tipo_usuario": "PROFISSIONAL",
  "telefone": "27999990001",
  "matricula": "P01",
  "especialidade_id": 1,
  "registro_prof": "CRP-01",
  "bio": "Psicólogo"
}
```

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "joao@gmail.com",
  "senha": "123456"
}
```

### Resposta de sucesso (register e login)

```json
{
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@gmail.com",
    "tipo_usuario": "PACIENTE"
  },
  "token": "eyJ..."
}
```

## Tipos de usuário

| Tipo | Descrição |
|---|---|
| `PACIENTE` | Aluno que agenda consultas |
| `PROFISSIONAL` | Nutricionista ou psicólogo |
| `ADMIN` | Administrador do sistema |
