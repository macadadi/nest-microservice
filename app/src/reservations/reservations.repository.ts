import { AbstractRepository } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationEntity } from './model/reservation.entity';

/**
 * Reservations repository providing data access operations for ReservationEntity
 * Extends AbstractRepository for common CRUD operations
 */
@Injectable()
export class ReservationsRepository extends AbstractRepository<ReservationEntity> {
  protected readonly logger = new Logger(ReservationsRepository.name);

  constructor(
    @InjectRepository(ReservationEntity)
    reservationRepository: Repository<ReservationEntity>,
  ) {
    super(reservationRepository);
  }

  /**
   * Find reservations by user ID
   */
  async findByUserId(userId: string): Promise<ReservationEntity[]> {
    return this.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * Find reservations by place ID
   */
  async findByPlaceId(placeId: string): Promise<ReservationEntity[]> {
    return this.find({
      where: { placeId },
      order: { startDate: 'ASC' },
    });
  }

  /**
   * Find reservations within a date range
   */
  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<ReservationEntity[]> {
    return this.repository
      .createQueryBuilder('reservation')
      .where('reservation.startDate <= :endDate', { endDate })
      .andWhere('reservation.endDate >= :startDate', { startDate })
      .orderBy('reservation.startDate', 'ASC')
      .getMany();
  }
}
