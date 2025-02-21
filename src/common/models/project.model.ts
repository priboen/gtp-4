import {
  BelongsTo,
  Column,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Task } from './task.model';
import { Events } from './events.model';

@Table({ tableName: 'projects' })
export class Project extends Model {
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
}
