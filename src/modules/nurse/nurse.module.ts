import { Module } from '@nestjs/common';
import { NurseController } from './nurse.controller';
import { NurseService } from './nurse.service';
import { FileService } from '../file/file.service';
import { NotificationService } from '../notification/services/notification.service';
import { FcmIntegrationService } from 'src/integration/notify/fcm-integration.service';
import { TransactionService } from '../transaction/transaction.service';

@Module({
  controllers: [NurseController],
  providers: [
    NurseService,
    TransactionService,
    FileService,
    NotificationService,
    FcmIntegrationService,
  ],
})
export class NurseModule {}
