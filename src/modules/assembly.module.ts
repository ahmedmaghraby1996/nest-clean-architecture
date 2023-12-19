import { AddressModule } from './address/address.module';

import { Module } from '@nestjs/common';
import { AdditionalInfoModule } from './additional-info/additional-info.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
    imports: [
        AddressModule,
        AdditionalInfoModule,
        ReservationModule,
    ],
    exports: [
        AddressModule,
    ],
})
export class AssemblyModule { }
