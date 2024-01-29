import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class makeOrderRequest {
  @ApiProperty({
    type: [String],

    
  })
  @IsOptional()
  categories: string;


  @ApiPropertyOptional({
    type: [String],
    required: false,
    example: ['drug1_id', 'drug1_id'],
  })
  @IsOptional()
  drugs: string;

  @ApiProperty({ required: false })
  notes: string;
  @ApiProperty()
  address_id: string;

  @ApiPropertyOptional({
    type: [String],
    required: false,
    example: ['storage/tmp/image1.png', 'storage/tmp/image2.png'],
  })
  @IsOptional()
 attachments: string[];

  @ApiPropertyOptional({
    type: [String],
    required: false,
    example: ['storage/tmp/image1.png', 'storage/tmp/image2.png'],
  })
  @IsOptional()
voice_recording: string[];


}
