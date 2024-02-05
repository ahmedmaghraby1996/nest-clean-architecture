import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NurseOfferRequest {
  @ApiProperty()
  @IsString()
  nurse_order_id: string;

  @ApiProperty()
  value: number;

  @ApiProperty({ required: false })
  notes: string;
}
