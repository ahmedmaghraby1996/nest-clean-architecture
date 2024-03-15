import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString } from "class-validator";
import { Column } from "typeorm";

export class CreatePackageRequest {
    @ApiProperty()
    @IsString()
    name_ar: string;
    @ApiProperty()
    @IsString()
    name_en: string;
    @ApiProperty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    price: number;
    @ApiProperty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    expiration_days: number;
    @ApiProperty({required:false})
    @IsOptional()
    @IsString()
    description_ar: string;
    @ApiProperty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    number_of_clinic_order: number;

   
}