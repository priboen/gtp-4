import { Sequelize } from 'sequelize-typescript';
import { mysqlConfig } from '../config/mysql.config';
import { User, Task, Events, Project } from '../models';
import { TeamProject } from '../models/team-project.model';

export const mysqlProvider = {
  provide: 'SEQUELIZE',
  useFactory: async () => {
    const sequelize = new Sequelize(mysqlConfig);
    sequelize.addModels([User, Task, Events, Project, TeamProject]);
    await sequelize.sync();
    return sequelize;
  },
};
