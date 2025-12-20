import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import {
  BaseController,
  PaginationDto,
  PaginatedResponse,
} from '@app/common';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController extends BaseController {
  constructor(private readonly reservationsService: ReservationsService) {
    super(ReservationsController.name);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new reservation' })
  @ApiResponse({ status: 201, description: 'Reservation created successfully' })
  create(@Body() createReservationDto: CreateReservationDto) {
    this.logInfo('Creating reservation', createReservationDto);
    return this.reservationsService.create(createReservationDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reservations' })
  @ApiResponse({
    status: 200,
    description: 'Reservations retrieved successfully',
    type: PaginatedResponse,
  })
  findAll(@Query() pagination: PaginationDto) {
    this.logInfo('Finding all reservations', { pagination });
    return this.reservationsService.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reservation by ID' })
  @ApiResponse({ status: 200, description: 'Reservation retrieved successfully' })
  findOne(@Param('id') id: string) {
    this.logInfo('Finding reservation', { reservationId: id });
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a reservation' })
  @ApiResponse({ status: 200, description: 'Reservation updated successfully' })
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    this.logInfo('Updating reservation', { reservationId: id });
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a reservation' })
  @ApiResponse({ status: 200, description: 'Reservation deleted successfully' })
  remove(@Param('id') id: string) {
    this.logInfo('Removing reservation', { reservationId: id });
    return this.reservationsService.remove(id);
  }
}
