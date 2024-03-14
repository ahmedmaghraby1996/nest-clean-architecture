import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { TransactionService } from '../transaction/transaction.service';

@Module({
  providers: [PackageService,TransactionService],
  controllers: [PackageController]
})
export class PackageModule {}
