import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Sequelize } from 'sequelize';

const dataDirectory = fileURLToPath(new URL('../../data', import.meta.url));
const databasePath = fileURLToPath(
  new URL('../../data/analytics.db', import.meta.url),
);

fs.mkdirSync(dataDirectory, { recursive: true });

const database = new Sequelize({
  dialect: 'sqlite',
  storage: databasePath,
  logging: false,
});

export default database;
