import { AssemblyModule } from './modules/assembly.module';
import { IntegrationModule } from './integration/integration.module';
import { UserModule } from './modules/user/user.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { FileModule } from './modules/file/file.module';
import { AdditionalInfoModule } from './modules/additional-info/additional-info.module';
import { Reservation } from './infrastructure/entities/reservation/reservation.entity';
import { ReservationModule } from './modules/reservation/reservation.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { NotificationModule } from './modules/notification/notification.module';

@Module({
  imports: [
    AssemblyModule,         // ?Assembly
    CoreModule,             // !Global
    InfrastructureModule,   // !Global
    IntegrationModule,      // !Global
    UserModule,             // !Global
    AuthenticationModule,   // !Global
    FileModule,             // !Global
  
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
