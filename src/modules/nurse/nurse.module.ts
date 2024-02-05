import { Module } from '@nestjs/common';
import { NurseController } from './nurse.controller';
import { NurseService } from './nurse.service';
import { FileService } from '../file/file.service';

@Module({
  controllers: [NurseController],
  providers: [NurseService,FileService]
})
export class NurseModule {}
