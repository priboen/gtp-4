import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { Project } from './project.model';
import { EventAttendances } from './event-attendance.model';

@Table({ tableName: 'events' })
export class Events extends Model {
  @Column
  name: string;

  @Column
  description: string;

  @Column
  date: Date;

  @ForeignKey(() => Project)
  @Column
  projectId: number;

  @BelongsTo(() => Project, { onDelete: 'CASCADE' })
  project: Project;

  @HasMany(() => EventAttendances, { onDelete: 'CASCADE' })
  attendances: EventAttendances[];
}
