import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class ClientInfoRequest {
  @ApiPropertyOptional()
  @IsOptional()
  weight: number;

  @ApiPropertyOptional()
  @IsOptional()
  height: number;

  @ApiPropertyOptional()
  @IsOptional()
  notes: string;

  @ApiPropertyOptional()
  @IsOptional()
  allergic_reactions: string;
}
