import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Validate,
  ValidateIf,
  isEnum,
} from 'class-validator';
import { ReservationType } from 'src/infrastructure/data/enums/reservation-type';

export class urgentReservationRequest {
  @ApiProperty({
    default: ReservationType.VIDEO_CALL,
    enum: [
      ReservationType.VIDEO_CALL,
      ReservationType.CALL,
      ReservationType.MEETING,
      ReservationType.CLINIC,
    ],
  })
  @IsNotEmpty()
  @IsEnum(ReservationType)
  reservationType: ReservationType;

  @ApiPropertyOptional({required: false})
  // @IsOptional()
    @IsNotEmpty()
      @IsString()
  @ValidateIf((obj) => obj.reservationType === ReservationType.MEETING)
  address_id: string;

  @ApiProperty({ required: false })
  @IsNotEmpty()
  specialization_id: string;

  @ApiProperty({ required: false })
  family_member_id: string;

  @ApiProperty({ required: false })
  phone: string;

  @ApiProperty({ required: false })
  note: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  promo_code_id: string;

  
  @ApiPropertyOptional({
    type: [String],
    required: false,
    example: ['storage/tmp/image1.png', 'storage/tmp/image2.png'],
  })
  @IsOptional()
  files: string[];
}

export class AvaliablityRequest {
  @ApiProperty()
  day: number;

  @ApiProperty()
  start_at: number;

  @ApiProperty()
  end_at: number;
}
