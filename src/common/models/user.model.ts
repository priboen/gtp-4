import { Table, Column, Model } from 'sequelize-typescript';

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
}
