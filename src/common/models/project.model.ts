import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Task } from './task.model';
import { Events } from './events.model';
import { TeamProject } from './team-project.model';

@Table({ tableName: 'projects' })
export class Project extends Model<Project> {
  @Column
  name: string;

  @ForeignKey(() => User)
  @Column
  ownerId: number;

  @BelongsTo(() => User)
  owner: User;

  @HasMany(() => Task)
  tasks: Task[];

  @HasMany(() => Events)
  events: Events[];

  @HasMany(() => TeamProject)
  projectUsers: TeamProject[];
}
