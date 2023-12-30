import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class compeleteReservationRequest {
  @ApiProperty()
  id: string;
  @ApiPropertyOptional({
    type: [String],
    required: false,
    example: ['storage/tmp/image1.png', 'storage/tmp/image2.png'],
  })
  @IsOptional()
  files: string[];
}
