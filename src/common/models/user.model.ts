import { Table, Column, Model, HasMany } from 'sequelize-typescript';
import { TeamProject } from './team-project.model';

@Table({
  tableName: 'users',
})
export class User extends Model {
  @Column
  name: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column
  password: string;

  @HasMany(() => TeamProject, { onDelete: 'CASCADE' })
  teamProjects: TeamProject[];
}
