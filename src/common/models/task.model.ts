import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Project } from './project.model';

@Table({ tableName: 'tasks' })
export class Task extends Model {
  @Column
  title: string;

  @Column
  description: string;

  @Column({ defaultValue: 'pending' })
  status: string;

  @ForeignKey(() => Project)
  @Column
  projectId: number;

  @BelongsTo(() => Project, { onDelete: 'CASCADE' })
  project: Project;
}
