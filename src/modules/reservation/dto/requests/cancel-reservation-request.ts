import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CancelReservationRequest {
  @ApiProperty()
  @IsString()
  id: string;
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reason: string;
}
