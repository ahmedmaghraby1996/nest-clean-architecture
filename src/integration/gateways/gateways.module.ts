import { Module } from '@nestjs/common';
import { Reservation } from 'src/infrastructure/entities/reservation/reservation.entity';
import { ReservationGateway } from './reservation.gateway';

@Module({
    imports: [],
    providers: [
        ReservationGateway
    ],
    exports: [
    ],
})
export class GatewaysModule { }
