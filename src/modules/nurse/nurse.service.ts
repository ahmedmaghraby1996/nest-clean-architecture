import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nurse } from 'src/infrastructure/entities/nurse/nurse.entity';
import { LessThan, MoreThan, Repository, Transaction } from 'typeorm';
import { CreateNurseRequest } from './dto/request/create-nurse-request';
import { FileService } from '../file/file.service';
import { REQUEST } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import { NurseOrderRequest } from './dto/request/nurse-order-request';
import { Request } from 'express';
import { BaseUserService } from 'src/core/base/service/user-service.base';

import { NurseOrderResponse } from './dto/respone/nurse-order.response';
import { NurseLicense } from 'src/infrastructure/entities/nurse/nurse-license.entity';
import * as fs from 'fs';
import { UpdateNurseRequest } from './dto/request/update-nurse-request';

import { ReservationStatus } from 'src/infrastructure/data/enums/reservation-status.eum';
import { TransactionService } from '../transaction/transaction.service';
import { MakeTransactionRequest } from '../transaction/dto/requests/make-transaction-request';
@Injectable()
export class NurseService  {
  constructor(
  
    @InjectRepository(Nurse) private readonly nurseRepo: Repository<Nurse>,

    @Inject(TransactionService)
    private readonly transactionService: TransactionService,
    @InjectRepository(NurseLicense)
    private readonly nurseLicenseRepo: Repository<NurseLicense>,
    @Inject(FileService) private _fileService: FileService,

    @Inject(REQUEST) request: Request,
  ) {
   
  }

  async getNurse(id: string) {
    return await this.nurseRepo.findOne({
      where: { user_id: id },
      relations: { license_images: true },
    });
  }
  async addNurse(req: Partial<UpdateNurseRequest>, userId: string) {
    const nurse_id = await this.getNurse(userId);
    const nurse = plainToInstance(Nurse, {
      ...req,
      user_id: userId,
      id: nurse_id?.id,
    });
    delete nurse.license_images;

    await this.nurseRepo.save(nurse);

    if (req.license_images) {
      req.license_images.split(',').map((file) => {
        // check if image exists using fs
        const exists = fs.existsSync(file);
        if (!exists) throw new BadRequestException('file not found');
      });

      // save shipping order images
      const nurse_licenses = req.license_images.split(',').map((file) => {
        // create shipping-images folder if not exists
        if (!fs.existsSync('storage/nurse-licenses')) {
          fs.mkdirSync('storage/nurse-licenses');
        }
        // store the future path of the image
        const newPath = file.replace('/tmp/', '/nurse-licenses/');

        // use fs to move images
        return plainToInstance(NurseLicense, {
          image: newPath,
          nurse_id: nurse.id,
        });
      });

      await this.nurseLicenseRepo.save(nurse_licenses);
      req.license_images.split(',').map((image) => {
        const newPath = image.replace('/tmp/', '/nurse-licenses/');
        fs.renameSync(image, newPath);
      });
    }
    return nurse;
  }

  async deleteLicense(id: string) {
    const license = await this.nurseLicenseRepo.findOne({ where: { id } });
    fs.unlinkSync(license.image);
    await this.nurseLicenseRepo.remove(license);
  }

}
