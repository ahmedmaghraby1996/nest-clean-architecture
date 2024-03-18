import { Otp } from '../entities/auth/otp.entity';
import { User } from '../entities/user/user.entity';
import { Address } from '../entities/user/address.entity';
import { Doctor } from '../entities/doctor/doctor.entity';
import { DoctorLicense } from '../entities/doctor/doctor-license.entity';
import { Specialization } from '../entities/doctor/specialization.entity';

import { Nurse } from '../entities/nurse/nurse.entity';

import { NurseLicense } from '../entities/nurse/nurse-license.entity';
import { Transaction } from '../entities/wallet/transaction.entity';
import { Wallet } from '../entities/wallet/wallet.entity';
import { NotificationEntity } from '../entities/notification/notification.entity';
import { Client } from '../entities/client/client.entity';


export const DB_ENTITIES = [
  User,
  Address,
  Otp,
  Doctor,
  DoctorLicense,
  Specialization,
  Nurse,
  NurseLicense,
  Transaction,
  Wallet,
  NotificationEntity,
  Client,
  
];

export const DB_VIEWS = [];
