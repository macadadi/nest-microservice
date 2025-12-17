import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { ReservationEntity } from './model/reservation.entity';
import { BaseService } from '@app/common';

@Injectable()
export class ReservationsService extends BaseService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
  ) {
    super(ReservationsService.name);
  }

  create(
    createReservationDto: CreateReservationDto,
  ): Promise<ReservationEntity> {
    this.logInfo('Creating reservation', { userId: createReservationDto.userId });
    const reservation = this.reservationsRepository.create({
      ...createReservationDto,
      timestamp: Date.now(),
    });
    this.logInfo('Reservation created successfully');
    return reservation;
  }

  findAll(): Promise<ReservationEntity[]> {
    this.logInfo('Fetching all reservations');
    return this.reservationsRepository.find({});
  }

  findOne(id: string): Promise<ReservationEntity> {
    this.logInfo('Fetching reservation', { reservationId: id });
    return this.reservationsRepository.findOne({ where: { id } });
  }

  update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<ReservationEntity> {
    this.logInfo('Updating reservation', { reservationId: id });
    return this.reservationsRepository.findOneAndUpdate(
      { id },
      updateReservationDto,
    );
  }

  remove(id: string): Promise<ReservationEntity> {
    this.logInfo('Deleting reservation', { reservationId: id });
    return this.reservationsRepository.findOneAndDelete({ id });
  }
}
