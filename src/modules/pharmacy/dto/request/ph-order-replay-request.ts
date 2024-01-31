import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { PhOrderReplyType } from "src/infrastructure/data/enums/pharmacy-attachment-typs";

export class PhOrderReplyRequest {

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    order_id: string;

    @ApiProperty({required: false})
  
    @IsString()
    note: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    price: string;

    @ApiProperty()
    @IsEnum(PhOrderReplyType)
    availability: PhOrderReplyType;
}