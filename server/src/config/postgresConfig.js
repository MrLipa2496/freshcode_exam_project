require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST ?? 'localhost',
    dialect: 'postgres',
    port: Number(process.env.DB_PORT),
    seederStorage: 'sequelize',
  },
  test: {
    username: process.env.DB_USER,
    password: 'admin',
    database: 'squad-help-test',
    host: process.env.DB_HOST,
    dialect: 'postgres',
    seederStorage: 'sequelize',
  },
  production: {
    username: process.env.DB_USER,
    password: 'admin',
    database: 'squad-help-prod',
    host: process.env.DB_HOST,
    dialect: 'postgres',
    seederStorage: 'sequelize',
  },
};
