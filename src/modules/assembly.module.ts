import { AddressModule } from './address/address.module';

import { Module } from '@nestjs/common';
import { DoctorModule } from './doctor/doctor.module';
import { NotificationModule } from './notification/notification.module';
import { NurseModule } from './nurse/nurse.module';
import { TransactionModule } from './transaction/transaction.module';

@Module({
  imports: [
    AddressModule,
    NotificationModule,
    DoctorModule,
    NurseModule,
    TransactionModule,
  ],
  exports: [AddressModule],
})
export class AssemblyModule {}
