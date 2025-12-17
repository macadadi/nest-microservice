import { Entity, Column, Index } from 'typeorm';
import { AbstractEntity } from '@app/common';

@Entity('revoked_tokens')
@Index(['token'], { unique: true })
@Index(['expiresAt'])
export class RevokedTokenEntity extends AbstractEntity {
  @Column({ type: 'text', unique: true })
  @Index()
  token: string;

  @Column({ type: 'bigint' })
  expiresAt: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  userId?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tokenType?: string;
}
