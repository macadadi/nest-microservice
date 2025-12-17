import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { ReservationEntity } from './model/reservation.entity';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
  ) {}

  create(
    createReservationDto: CreateReservationDto,
  ): Promise<ReservationEntity> {
    return this.reservationsRepository.create({
      ...createReservationDto,
      timestamp: Date.now(),
    });
  }

  findAll(): Promise<ReservationEntity[]> {
    return this.reservationsRepository.find({});
  }

  findOne(id: string): Promise<ReservationEntity> {
    return this.reservationsRepository.findOne({ where: { id } });
  }

  update(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ): Promise<ReservationEntity> {
    return this.reservationsRepository.findOneAndUpdate(
      { id },
      updateReservationDto,
    );
  }

  remove(id: string): Promise<ReservationEntity> {
    return this.reservationsRepository.findOneAndDelete({ id });
  }
}
