export class CreateReservationDto {
  timestamp: number;
  startDate: Date;
  endDate: Date;
  userId: string;
  placeId: string;
  invoiceId: string;
}
