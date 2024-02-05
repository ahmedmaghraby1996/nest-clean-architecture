import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";
import { RegisterRequest } from "src/modules/authentication/dto/requests/register.dto";

export class CreateNurseRequest extends RegisterRequest{
   @ApiProperty()
   @IsNumber()
   @Transform(({value})=>parseInt(value))
   experience: number

   @ApiProperty({required:false})
   summary: string

   @ApiProperty({ type: 'file' ,required:false})
   license_img: Express.Multer.File;


}