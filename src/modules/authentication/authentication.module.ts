import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { Module, Global } from '@nestjs/common';
import { RegisterUserTransaction } from './transactions/register-user.transaction';
import { SendOtpTransaction } from './transactions/send-otp.transaction';
import { JwtService } from '@nestjs/jwt';
import { VerifyOtpTransaction } from './transactions/verify-otp.transaction';
import { JwtStrategy } from './strategies/jwt.strategy';
import JWTSetup from 'src/core/setups/jwt.setup';
import { AdditionalInfoService } from '../additional-info/additional-info.service';
import { PharmacyService } from '../pharmacy/pharmacy.service';
import { NurseService } from '../nurse/nurse.service';
import { FileService } from '../file/file.service';

@Global()
@Module({
  imports: [JWTSetup()],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    RegisterUserTransaction,
    SendOtpTransaction,
    VerifyOtpTransaction,
    JwtService,
    JwtStrategy,
    AdditionalInfoService,
    PharmacyService,
    NurseService,
    FileService,
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
