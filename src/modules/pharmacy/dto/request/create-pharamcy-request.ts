import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { RegisterRequest } from 'src/modules/authentication/dto/requests/register.dto';

export class CreatePharamcyRequest extends RegisterRequest {
  @ApiProperty()
  @IsString()
  ph_name: string;

  @ApiProperty()
  @IsLatitude()
  @IsNotEmpty()
  latitude: number;
  @ApiProperty()
  @IsLongitude()
  @IsNotEmpty()
  longitude: number;

  @ApiProperty()
  @IsString()
  open_time: string;
  @ApiProperty()
  @IsString()
  close_time: string;

  @ApiProperty()
  @IsString()
  summery: string;

  @ApiProperty()
  @IsString()
  expierence: number;

  @ApiPropertyOptional({
    type: [String],
    required: false,
    example: ['storage/tmp/image1.png', 'storage/tmp/image2.png'],
  })
  @IsOptional()
  license_images: string;

  @ApiPropertyOptional({
    type: [String],
    required: false,
    example: ['storage/tmp/image1.png', 'storage/tmp/image2.png'],
  })
  @IsOptional()
  logo_images: string;

  @ApiPropertyOptional({
    type: [String],
    required: false,
    example: ['category1_id', 'category1_id'],
  })
  @IsOptional()
  categories: string;


}
