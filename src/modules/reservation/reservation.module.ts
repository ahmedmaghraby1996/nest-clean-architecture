import { Module } from '@nestjs/common';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { AdditionalInfoService } from '../additional-info/additional-info.service';
import { OfferService } from './offer.service';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService,AdditionalInfoService,OfferService]})
export class ReservationModule {}
