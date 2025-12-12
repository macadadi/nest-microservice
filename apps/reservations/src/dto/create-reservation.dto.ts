import { IsDate, IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateReservationDto {
  timestamp: number;
  @IsDate()
  @Type(() => Date)
  startDate: Date;
  @IsDate()
  @Type(() => Date)
  endDate: Date;
  @IsString()
  @IsNotEmpty()
  userId: string;
  @IsString()
  @IsNotEmpty()
  placeId: string;
  @IsString()
  @IsNotEmpty()
  invoiceId: string;
}
