import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { AdditionalInfoService } from '../additional-info/additional-info.service';
import { OfferService } from './offer.service';
import { ReservationGateway } from 'src/integration/gateways/reservation.gateway';
import { NotificationService } from '../notification/services/notification.service';
import { FcmIntegrationService } from 'src/integration/notify/fcm-integration.service';
import { TransactionService } from '../transaction/transaction.service';

@Module({
  controllers: [ReservationController],
  providers: [
    ReservationService,
    TransactionService,
    FcmIntegrationService,
    AdditionalInfoService,
    OfferService,
    AdditionalInfoService,
    ReservationGateway,
    NotificationService,
  ],
})
export class ReservationModule {}
