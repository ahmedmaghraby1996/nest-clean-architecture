import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Doctor } from 'src/infrastructure/entities/doctor/doctor.entity';
import { Address } from 'src/infrastructure/entities/user/address.entity';
import { AddressModule } from 'src/modules/address/address.module';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { DoctorModule } from 'src/modules/doctor/doctor.module';
import { NurseModule } from 'src/modules/nurse/nurse.module';

import { TransactionModule } from 'src/modules/transaction/transaction.module';
import { UserModule } from 'src/modules/user/user.module';

export default (app: INestApplication, config: ConfigService) => {
  const operationIdFactory = (controllerKey: string, methodKey: string) =>
    methodKey;

  const publicConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(`${config.get('APP_NAME')} API`)
    .setDescription(`${config.get('APP_NAME')} API description`)
    .setVersion('v1')
    .setContact(
      'Contact',
      'https://github.com/mahkassem',
      'mahmoud.ali.kassem@gmail.com',
    )
    .setLicense(
      'Developed by Ahmed el-Maghraby',
      'https://github.com/mahkassem',
    )
    .addServer(config.get('APP_HOST'))  
    .build();

  const publicDocument = SwaggerModule.createDocument(app, publicConfig, {
    include: [
      AddressModule,
      DoctorModule,
      NurseModule,
      AuthenticationModule,
      UserModule,
      TransactionModule,
    ],
    operationIdFactory,
  });

  SwaggerModule.setup('swagger', app, publicDocument);
};
