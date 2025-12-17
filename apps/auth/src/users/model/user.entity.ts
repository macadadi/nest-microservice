import { Entity, Column, Index } from 'typeorm';
import { AbstractEntity } from '@app/common';
import { Exclude } from 'class-transformer';

/**
 * User entity representing a user in the system
 * Extends AbstractEntity for common fields (id, createdAt, updatedAt)
 */
@Entity('users')
@Index(['email'], { unique: true })
export class UserEntity extends AbstractEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 255 })
  @Exclude({ toPlainOnly: true })
  password: string;
}
