import { Module } from '@nestjs/common';
import { AdditionalInfoController } from './additional-info.controller';
import { AdditionalInfoService } from './additional-info.service';

@Module({
  controllers: [AdditionalInfoController],
  providers: [AdditionalInfoService]
})
export class AdditionalInfoModule {}
