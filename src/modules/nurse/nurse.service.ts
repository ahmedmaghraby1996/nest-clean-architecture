import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Nurse } from 'src/infrastructure/entities/nurse/nurse.entity';
import { Repository } from 'typeorm';
import { CreateNurseRequest } from './dto/request/create-nurse-request';
import { FileService } from '../file/file.service';
import { REQUEST } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import { NurseOrderRequest } from './dto/request/nurse-order-request';
import { Request } from 'express';
import { BaseUserService } from 'src/core/base/service/user-service.base';
import { NurserOrder } from 'src/infrastructure/entities/nurse/nurse-order.entity';
import { NurseOfferRequest } from './dto/request/nurse-offer-request';
import { NurseOffer } from 'src/infrastructure/entities/nurse/nurse-offer.entity';

@Injectable()
export class NurseService extends BaseUserService<NurserOrder> {
  constructor(
    @InjectRepository(NurserOrder)
    private readonly nurseOrderRepo: Repository<NurserOrder>,
    @InjectRepository(Nurse) private readonly nurseRepo: Repository<Nurse>,
    @InjectRepository(NurseOffer)
    private readonly nurseOfferRepo: Repository<NurseOffer>,
    @Inject(FileService) private _fileService: FileService,
    @Inject(REQUEST) request: Request,
  ) {
    super(nurseOrderRepo, request);
  }

  async addNurse(req: CreateNurseRequest, userId: string) {
    console.log(req);
    const nurse = new Nurse();

    nurse.user_id = userId;
    nurse.experience = req.experience;
    nurse.summary = req.summary;

    // resize image to 300x300
    const license_img = await this._fileService.upload(req.license_img);

    // set avatar path
    nurse.license_img = license_img;
    return this.nurseRepo.save(nurse);
  }

  async createNurseOrder(req: NurseOrderRequest) {
    const order = plainToInstance(Nurse, req);
    order.user_id = super.currentUser.id;
    return this.nurseOrderRepo.save(order);
  }

  async getOffers(id: string) {
    const offers = await this.nurseOfferRepo.find({
      where: { nurse_order_id: id },
      relations: { nurse: { user: true } },
  
    });
 
    return offers;
  }

  async sendOffer(req: NurseOfferRequest) {
    const offer = plainToInstance(NurseOffer, req);
    const nurse = await this.nurseRepo.findOne({
      where: { user_id: super.currentUser.id },
    });
    const sent_offer = await this.nurseOfferRepo.findOne({
      where: { nurse_id: nurse.id, nurse_order_id: req.nurse_order_id },
    });
    if (sent_offer) throw new BadRequestException('offer already sent');
    offer.nurse_id = nurse.id;
    return this.nurseOfferRepo.save(offer);
  }
}
