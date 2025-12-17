import { Entity, Column, Index } from 'typeorm';
import { AbstractEntity } from '@app/common';

/**
 * Reservation entity representing a reservation in the system
 * Extends AbstractEntity for common fields (id, createdAt, updatedAt)
 */
@Entity('reservations')
@Index(['userId'])
@Index(['placeId'])
@Index(['startDate', 'endDate'])
export class ReservationEntity extends AbstractEntity {
  @Column({ type: 'bigint' })
  timestamp: number;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ type: 'uuid' })
  @Index()
  userId: string;

  @Column({ type: 'uuid' })
  @Index()
  placeId: string;

  @Column({ type: 'uuid' })
  @Index()
  invoiceId: string;
}
