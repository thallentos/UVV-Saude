import knex from 'knex';
import 'dotenv/config';
import pg from 'pg';

// Impede o pg de converter campos date em objetos Date do JavaScript
// Mantém como string no formato YYYY-MM-DD
pg.types.setTypeParser(1082, (val: string) => val);

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    user: process.env.DB_USER ?? '',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? '',
  },
});

export default db;