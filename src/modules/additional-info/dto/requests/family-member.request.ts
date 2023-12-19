import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ClientInfoRequest } from "./client-info-request";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Gender } from "src/infrastructure/data/enums/gender.enum";
import { Unique } from "typeorm";

export class FamilyMemberRequest extends ClientInfoRequest{


    @ApiPropertyOptional()
    @IsOptional()
    kinship:string

    
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    first_name: string;
  
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    last_name: string;
  
 
    @ApiPropertyOptional()
    @IsOptional()
    @IsNotEmpty()
    birth_date:string
  
    @ApiPropertyOptional()
    @IsOptional()
    @ApiProperty({ default: Gender.MALE, enum: [Gender.MALE, Gender.FEMALE] })
    @IsEnum(Gender)
    gender: Gender;

  
  
  
    @ApiProperty({ type: 'file', required: false })
    @IsOptional()
    avatarFile: Express.Multer.File;
}