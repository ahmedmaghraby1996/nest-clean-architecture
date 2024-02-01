import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PhOrderReplyType } from 'src/infrastructure/data/enums/pharmacy-attachment-typs';

export class PhOrderReplyRequest {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  order_id: string;

  @ApiPropertyOptional()

  note: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  price: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty()
  @IsEnum(PhOrderReplyType)
  availability: PhOrderReplyType;
}
