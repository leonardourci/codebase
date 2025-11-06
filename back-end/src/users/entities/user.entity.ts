import { nanoid } from 'nanoid';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

export const USER_ID_PREFIX = 'user_';

export type UserIdType = `${typeof USER_ID_PREFIX}${string}`;

@Entity('users')
export class User {
  /**
   * User id with prefix 'user_'
   * @example user_XYZ123abc
   */
  @PrimaryColumn()
  id: UserIdType;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column({ nullable: true })
  refreshToken: string;

  @Column({ default: 'user' })
  role?: string;

  @BeforeInsert()
  private generateId() {
    this.id = `${USER_ID_PREFIX}${nanoid()}`;
  }

  @BeforeUpdate()
  private updateTimeStamp() {
    this.updatedAt = new Date();
  }
}
