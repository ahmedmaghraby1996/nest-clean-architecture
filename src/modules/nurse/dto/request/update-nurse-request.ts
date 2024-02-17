import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";
import { RegisterRequest } from "src/modules/authentication/dto/requests/register.dto";

export class UpdateNurseRequest {
   @ApiPropertyOptional()
   @IsNumber()
   @Transform(({value})=>parseInt(value))
   experience: number

   @ApiProperty({required:false})
   summary: string

   @ApiProperty({
      type: [String],
      required: false,
      example: 'storage/tmp/image1.png', 
    })
  
    license_images: string;


}