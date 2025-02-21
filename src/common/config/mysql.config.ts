import { SequelizeOptions } from 'sequelize-typescript';

export const mysqlConfig: SequelizeOptions = {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'gtp-4',
};
