import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Project } from './project.model';

@Table({ tableName: 'team_projects' })
export class TeamProject extends Model<TeamProject> {
  @ForeignKey(() => Project)
  @Column
  projectId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => Project, { onDelete: 'CASCADE' })
  project: Project;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  user: User;
}
