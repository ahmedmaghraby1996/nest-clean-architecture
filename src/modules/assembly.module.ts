import { AddressModule } from './address/address.module';

import { Module } from '@nestjs/common';
import { AdditionalInfoModule } from './additional-info/additional-info.module';

@Module({
    imports: [
        AddressModule,
        AdditionalInfoModule,
    ],
    exports: [
        AddressModule,
    ],
})
export class AssemblyModule { }
