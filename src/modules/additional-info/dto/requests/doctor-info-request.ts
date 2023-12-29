import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from "class-validator";

export class DoctorInfoRequest{

  @ApiPropertyOptional()
 
  Video_consultation_price:number;
  
  
  @ApiPropertyOptional()

  voice_consultation_price:number;
  
  @ApiPropertyOptional()

  home_consultation_price:number;


@ApiPropertyOptional()

specialization_id:string

@ApiPropertyOptional()

@IsOptional()
summery :string

@ApiPropertyOptional()

@IsOptional()
@Transform(({ value} ) => Number( value) )
year_of_experience :number

@ApiPropertyOptional()

@IsOptional()
@Transform(({ value} ) => value === "true" || value === true)
has_clinc :boolean

@ApiPropertyOptional()
@IsOptional()
@Transform(({ value} ) => value === "true" || value === true)
is_urgent :boolean

@ApiPropertyOptional()
@IsOptional()

@IsString()
@Matches(
  /^(\+|-)?(?:90(?:(?:\.0{1,15})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,15})?))$/,
  { message: 'invalid value for latitude' },
)
clinc_latitude: string;

@ApiPropertyOptional()
@IsOptional()
@IsString()
@Matches(
  /^(\+|-)?(?:180(?:(?:\.0{1,15})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,15})?))$/,
  { message: 'invalid value for longitude' },
)
clinc_longitude: string;

@ApiPropertyOptional()
@IsOptional()

@IsString()
@Matches(
  /^(\+|-)?(?:90(?:(?:\.0{1,15})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,15})?))$/,
  { message: 'invalid value for latitude' },
)
latitude: string;

@ApiPropertyOptional()
@IsOptional()
@IsString()
@Matches(
  /^(\+|-)?(?:180(?:(?:\.0{1,15})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,15})?))$/,
  { message: 'invalid value for longitude' },
)
longitude: string;

@ApiPropertyOptional({ type: [String], required: false, example: ['storage/tmp/image1.png', 'storage/tmp/image2.png'] })
@IsOptional() 
license_images: string;



}