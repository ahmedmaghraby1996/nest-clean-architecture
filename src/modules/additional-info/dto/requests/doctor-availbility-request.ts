import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsDate, IsDateString, IsNotEmpty, IsString } from "class-validator";

export class DoctorAvaliablityRequest {
    @ApiProperty()
    @IsNotEmpty()
   @IsDate()
   @Transform(({ value }) => new Date(value))
    date: Date;

    @ApiProperty()
    @IsNotEmpty()
  
    day: number;


    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    doctor_id: string


    constructor(
        data:Partial<DoctorAvaliablityRequest>
    ){
        Object.assign(this,data)
    }



}