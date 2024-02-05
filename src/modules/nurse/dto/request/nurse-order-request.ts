import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class NurseOrderRequest {
  @ApiProperty()
  @IsString()
  address_id: string;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date_from: Date;

  @ApiProperty()
  @IsDate()
  @Transform(({ value }) => new Date(value))
  date_to: Date;

  @ApiProperty({ required: false })
  notes: string;
}
