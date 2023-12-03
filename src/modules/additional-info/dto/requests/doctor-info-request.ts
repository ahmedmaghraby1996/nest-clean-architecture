import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Matches } from "class-validator";

export class DoctorInfoRequest{

@ApiPropertyOptional({type:[String]})

specializations:string[]

@ApiPropertyOptional()
@IsNumber()

year_of_experience :number

@ApiPropertyOptional({ type: [String], required: false, example: ['storage/tmp/image1.png', 'storage/tmp/image2.png'] })
@IsOptional() @Matches(/^(?:.*\.(?:png|jpg|jpeg))$/, { each: true, message: 'invalid image format, allowed: png, jpg, jpeg' })
license_images: string[];

}