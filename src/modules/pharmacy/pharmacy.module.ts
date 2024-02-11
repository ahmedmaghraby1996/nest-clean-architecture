import { Module } from '@nestjs/common';
import { PharmacyController } from './pharmacy.controller';
import { PharmacyService } from './pharmacy.service';
import { NotificationService } from '../notification/services/notification.service';
import { FcmIntegrationService } from 'src/integration/notify/fcm-integration.service';
import { PhOrderGateway } from 'src/integration/gateways/ph-order.gateway';

@Module({
  controllers: [PharmacyController],
  providers: [PharmacyService, NotificationService, FcmIntegrationService,PhOrderGateway],
})
export class PharmacyModule {}
