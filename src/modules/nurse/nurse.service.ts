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
import { NurseOrder } from 'src/infrastructure/entities/nurse/nurse-order.entity';
import { NurseOfferRequest } from './dto/request/nurse-offer-request';
import { NurseOffer } from 'src/infrastructure/entities/nurse/nurse-offer.entity';
import { generateOrderNumber } from '../reservation/reservation.service';
import { NotificationService } from '../notification/services/notification.service';
import { NotificationEntity } from 'src/infrastructure/entities/notification/notification.entity';
import { NotificationTypes } from 'src/infrastructure/data/enums/notification-types.enum';
import { NurseOrderGateway } from 'src/integration/gateways/nurse-order.gateway';
import { NurseOrderResponse } from './dto/respone/nurse-order.response';

@Injectable()
export class NurseService extends BaseUserService<NurseOrder> {
  constructor(
    @InjectRepository(NurseOrder)
    private readonly nurseOrderRepo: Repository<NurseOrder>,
    @InjectRepository(Nurse) private readonly nurseRepo: Repository<Nurse>,
    @InjectRepository(NurseOffer)
    private readonly nurseOfferRepo: Repository<NurseOffer>,
    @Inject(FileService) private _fileService: FileService,
    @Inject(NotificationService)
    public readonly notificationService: NotificationService,
    private readonly nurseOrderGateway: NurseOrderGateway,
    @Inject(REQUEST) request: Request,
  ) {
    super(nurseOrderRepo, request);
  }


  async getNurse(id:string){
    return await this.nurseRepo.findOne({where:{user_id:id}});
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
    const order = plainToInstance(NurseOrder, req);
    const count = await this._repo
      .createQueryBuilder('nurse_order')
      .where('DATE(nurse_order.created_at) = CURDATE()')
      .getCount();
    order.number = generateOrderNumber(count);
    order.user_id = super.currentUser.id;

    const nurses = await this.nurseRepo.find();
    nurses.forEach((nurse) => {
      this.nurseOrderGateway.server.emit(`nurse-${nurse.id}`, plainToInstance(NurseOrderResponse, order));
      this.notificationService.create(
        new NotificationEntity({
          user_id: nurse.user_id,
          url: nurse.user_id,
          type: NotificationTypes.ORDER,
          title_ar: 'لديك طلب جديد',
          title_en: 'you have a new order',
          text_ar: 'لديك طلب جديد',
          text_en: 'you have a new order',
        }),
      );
    });
    return this.nurseOrderRepo.save(order);
  }

  async getOffers(id: string) {
    const nurse = await this.nurseRepo.findOne({
      where: { user_id: super.currentUser.id },
    })
    const offers = await this.nurseOfferRepo.find({
      where: { nurse_order_id: id,nurse_id:nurse===null?null:nurse.id },
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

    const order = await this.nurseOrderRepo.findOne({
      where: { id: req.nurse_order_id },
    });

    this.notificationService.create(
      new NotificationEntity({
        user_id: order.user_id,
        url: order.user_id,
        type: NotificationTypes.ORDER,
        title_ar: 'لديك طلب جديد',
        title_en: 'you have a new order',
        text_ar: 'لديك طلب جديد',
        text_en: 'you have a new order',
      }),
    );
    return this.nurseOfferRepo.save(offer);
  }

  async sentOffer(nurse_order_id: string, nurse_id: string) {
    const reply = await this.nurseOfferRepo.findOne({
      where: { nurse_order_id, nurse_id },
    });
    if (reply) return true;
    return false;
  }
}
