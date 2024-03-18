import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Unique } from 'src/core/validators/unique-constraints.validator';
import { Gender } from 'src/infrastructure/data/enums/gender.enum';
import { Role } from 'src/infrastructure/data/enums/role.enum';


export class RegisterRequest {
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
  @IsEmail()
  @Unique('User')
  email?: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  birth_date:string

  @ApiPropertyOptional()
  @IsOptional()
  @ApiProperty({ default: Gender.MALE, enum: [Gender.MALE, Gender.FEMALE] })
  @IsEnum(Gender)
  gender: Gender;
  @ApiProperty()
  @IsNotEmpty()
  @Unique('User')
  phone: string;



  @ApiProperty({ type: 'file', required: false })
  @IsOptional()
  avatarFile: Express.Multer.File;

  @ApiProperty({ default: Role.CLIENT, enum: [Role.CLIENT, Role.DOCTOR,Role.PHARMACY,Role.NURSE ] })
  @IsNotEmpty()
  @IsEnum(Role)
  role: Role;
}
    