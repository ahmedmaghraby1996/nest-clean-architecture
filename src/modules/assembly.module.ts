import { AddressModule } from './address/address.module';

import { Module } from '@nestjs/common';
import { AdditionalInfoModule } from './additional-info/additional-info.module';
import { ReservationModule } from './reservation/reservation.module';
import { NotificationModule } from './notification/notification.module';
import { DoctorModule } from './doctor/doctor.module';
import { PharmacyModule } from './pharmacy/pharmacy.module';

@Module({
    imports: [
        AddressModule,
        AdditionalInfoModule,
        ReservationModule,
        NotificationModule,
        DoctorModule,
        PharmacyModule,
        
    ],
    exports: [
        AddressModule,
    ],
})
export class AssemblyModule { }
