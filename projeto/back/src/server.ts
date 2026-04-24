import 'dotenv/config';
import app from './app.js';
import db from './config/database.js';

const PORT = process.env.PORT ?? 3000;

async function main() {
    await db.raw('SELECT 1'); // testa a conexão com o banco
    console.log('Conectado ao banco de dados...');

    app.listen(PORT, () => {
        console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
}

main().catch((err) => {
    console.error('Falha ao iniciar o servidor:', err);
    process.exit(1);
});