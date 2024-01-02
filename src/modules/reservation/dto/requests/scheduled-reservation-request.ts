import { ApiProperty } from '@nestjs/swagger';
import { urgentReservationRequest } from './urgent_reservation_request';
import { Transform } from 'class-transformer';

export class SechudedReservationRequest extends urgentReservationRequest {
  @ApiProperty()
  @Transform(({ value }) => new Date(value))
  start_date: Date;

  @ApiProperty()
  doctor_id: string;
}
    