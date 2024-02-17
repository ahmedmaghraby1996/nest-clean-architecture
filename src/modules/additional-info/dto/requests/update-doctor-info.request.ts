import { ApiBody, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { RegisterRequest } from 'src/modules/authentication/dto/requests/register.dto';
import { Roles } from 'src/modules/authentication/guards/roles.decorator';

export class UpdateDoctorInfoRequest  {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  video_consultation_price: number;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  voice_consultation_price: number;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  home_consultation_price: number;

  @ApiProperty({required:false})
  @Transform(({ value }) => Number(value))

  clinic_consultation_price: number;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  specialization_id: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  summery: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => Number(value))
  @IsOptional()
  year_of_experience: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsOptional()
  is_urgent: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsOptional()
  @Matches(
    /^(\+|-)?(?:90(?:(?:\.0{1,15})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,15})?))$/,
    { message: 'invalid value for latitude' },
  )
  latitude: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsOptional()
  @Matches(
    /^(\+|-)?(?:180(?:(?:\.0{1,15})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,15})?))$/,
    { message: 'invalid value for longitude' },
  )
  longitude: string;

  @ApiPropertyOptional({
    type: [String],
    required: false,
    example: ['storage/tmp/image1.png', 'storage/tmp/image2.png'],
  })
  @IsOptional()
  license_images: string;

  @ApiPropertyOptional({
    required: false,
    type: '[String]',
    example: [{ day: 1, start_at: 10, end_at: 12, is_active: true }],
  })
  @IsOptional()
  // @IsArray()
  // @ValidateNested({ each: true })
  avaliablity: string;

  @ApiPropertyOptional({
    required: false,
    type: 'string',
    example: {
      latitude: 'latitude',
      longitude: 'longitude',
      address: 'address',
      name: 'name',
      is_active: true,
    },
  })
  @IsOptional()
  // @IsArray()

  // @ValidateNested({ each: true })
  clinic: string;
}
