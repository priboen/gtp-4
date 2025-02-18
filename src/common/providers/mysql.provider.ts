import { Sequelize } from 'sequelize-typescript';
import { mysqlConfig } from '../config/mysql.config';
import { User } from '../models';

export const mysqlProvider = {
  provide: 'SEQUELIZE',
  useFactory: async () => {
    const sequelize = new Sequelize(mysqlConfig);
    sequelize.addModels([User]);
    await sequelize.sync();
    return sequelize;
  },
};
