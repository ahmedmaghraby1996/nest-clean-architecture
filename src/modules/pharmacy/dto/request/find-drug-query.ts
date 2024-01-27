import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class FindDrugQuery {

@ApiProperty ()
@IsString()
@IsNotEmpty()
category_id:string

@ApiProperty ()
@IsString()
@IsNotEmpty()
name:string




}