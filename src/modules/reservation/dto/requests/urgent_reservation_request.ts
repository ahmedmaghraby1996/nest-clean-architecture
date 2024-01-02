import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Validate,
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
    ],
  })
  @IsNotEmpty()
  @IsEnum(ReservationType)
  reservationType: ReservationType;

  @ApiPropertyOptional()
  @IsOptional()
  @Validate((value, args) => {
    const reservationType = args.object['reservationType'];

    // Custom validation logic
    if (reservationType == 'MEETING' && value == null) {
      return false;
    }
  })
address_id: string

 
  

  @ApiProperty({ required: false })
  @IsNotEmpty()
  specialization_id: string;

  @ApiProperty({ required: false })
  family_member_id: string;

  @ApiProperty({ required: false })
  phone: string;

  @ApiProperty({ required: false })
  note: string;

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
