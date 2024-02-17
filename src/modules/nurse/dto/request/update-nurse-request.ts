import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
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

   @ApiProperty({
      type: [String],
      required: false,
      example: ['storage/tmp/image1.png', 'storage/tmp/image2.png'],
    })
  
    license_images: string;


}