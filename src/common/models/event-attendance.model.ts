import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.model';
import { Events } from './events.model';

@Table({ tableName: 'event_attendances' })
export class EventAttendances extends Model<EventAttendances> {
  @ForeignKey(() => Events)
  @Column
  eventId: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  @BelongsTo(() => Events, { onDelete: 'CASCADE' })
  event: Events;

  @BelongsTo(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'boolean', allowNull: true, defaultValue: null })
  isAttending: boolean | null;
}
