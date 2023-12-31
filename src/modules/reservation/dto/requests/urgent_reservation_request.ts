import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsOptional, IsString, Matches, isEnum } from "class-validator";
import { ReservationType } from "src/infrastructure/data/enums/reservation-type";


export class urgentReservationRequest{
    @ApiProperty({ default: ReservationType.VIEDO_CALL, enum: [ReservationType.VIEDO_CALL, ReservationType.CALL,ReservationType.MEETING] })
    @IsNotEmpty()
  @IsEnum(ReservationType)
reservationType:ReservationType




@ApiPropertyOptional()
@IsOptional()

@IsString()
@Matches(
  /^(\+|-)?(?:90(?:(?:\.0{1,15})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,15})?))$/,
  { message: 'invalid value for latitude' },
)

latitude: number;

@ApiPropertyOptional()
@IsOptional()
@IsString()
@Matches(
  /^(\+|-)?(?:180(?:(?:\.0{1,15})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,15})?))$/,
  { message: 'invalid value for longitude' },
)

longitude: number;

@ApiProperty({ required: false })
@IsNotEmpty()
specialization_id:string

@ApiProperty({ required: false })

family_member_id:string

@ApiProperty({ required: false })

phone:string

@ApiProperty({ required: false })

note:string


@ApiPropertyOptional({ type: [String], required: false, example: ['storage/tmp/image1.png', 'storage/tmp/image2.png'] })
@IsOptional() 
files: string[];



}