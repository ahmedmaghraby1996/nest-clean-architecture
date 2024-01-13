import { AddressModule } from './address/address.module';

import { Module } from '@nestjs/common';
import { AdditionalInfoModule } from './additional-info/additional-info.module';
import { ReservationModule } from './reservation/reservation.module';
import { NotificationModule } from './notification/notification.module';
import { DoctorModule } from './doctor/doctor.module';

@Module({
    imports: [
        AddressModule,
        AdditionalInfoModule,
        ReservationModule,
        NotificationModule,
        DoctorModule,
        
    ],
    exports: [
        AddressModule,
    ],
})
export class AssemblyModule { }
