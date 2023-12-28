import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";
import { ReservationType } from "src/infrastructure/data/enums/reservation-type";


export class urgentReservationRequest{
    @ApiProperty({ default: ReservationType.VEDIO_CALL, enum: [ReservationType.VEDIO_CALL, ReservationType.CALL,ReservationType.MEETING] })
    @IsNotEmpty()
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
@Transform((value) => Number(value))
longitude: number;

@ApiProperty({ required: false })
@IsNotEmpty()
specialization_id:string

@ApiProperty({ required: false })

family_member_id:string

@ApiProperty({ required: false })
@IsNotEmpty()
phone:string

@ApiProperty({ required: false })
@IsNotEmpty()
note:string


@ApiPropertyOptional({ type: [String], required: false, example: ['storage/tmp/image1.png', 'storage/tmp/image2.png'] })
@IsOptional() 
files: string[];



}