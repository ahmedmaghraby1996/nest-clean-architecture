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
import { NurseLicense } from 'src/infrastructure/entities/nurse/nurse-license.entity';
import * as fs from 'fs';
import { UpdateNurseRequest } from './dto/request/update-nurse-request';
@Injectable()
export class NurseService extends BaseUserService<NurseOrder> {
  constructor(
    @InjectRepository(NurseOrder)
    private readonly nurseOrderRepo: Repository<NurseOrder>,
    @InjectRepository(Nurse) private readonly nurseRepo: Repository<Nurse>,
    @InjectRepository(NurseOffer)
    private readonly nurseOfferRepo: Repository<NurseOffer>,
    @InjectRepository(NurseLicense)
    private readonly nurseLicenseRepo: Repository<NurseLicense>,
    @Inject(FileService) private _fileService: FileService,
    @Inject(NotificationService)
    public readonly notificationService: NotificationService,
    private readonly nurseOrderGateway: NurseOrderGateway,
    @Inject(REQUEST) request: Request,
  ) {
    super(nurseOrderRepo, request);
  }

  async getNurse(id: string) {
    return await this.nurseRepo.findOne({ where: { user_id: id } });
  }
  async addNurse(req: Partial<UpdateNurseRequest>, userId: string) {
    const nurse_id = await this.getNurse(userId);
    const nurse = plainToInstance(Nurse, {
      ...req,
      user_id: userId,
      id: nurse_id?.id,
    });

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

  async createNurseOrder(req: NurseOrderRequest) {
    const order = plainToInstance(NurseOrder, req);
    const count = await this._repo
      .createQueryBuilder('nurse_order')
      .where('DATE(nurse_order.created_at) = CURDATE()')
      .getCount();
    order.number = generateOrderNumber(count);
    order.user_id = super.currentUser.id;
    await this.nurseOrderRepo.save(order);
    const nurses = await this.nurseRepo.find();
    await Promise.all(
      nurses.map(async (nurse) => {
        this.nurseOrderGateway.server.emit(
          `nurse-${nurse.user_id}`,
          plainToInstance(
            NurseOrderResponse,
            await this.getSingleOrder(order.id),
          ),
        );
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
      }),
    );

    return order;
  }

  async getSingleOrder(id: string) {
    return await this.nurseOrderRepo.findOne({
      where: { id },
      relations: { user: true, address: true },
    });
  }

  async getOffers(id: string) {
    const nurse = await this.nurseRepo.findOne({
      where: { user_id: super.currentUser.id },
    });
    const offers = await this.nurseOfferRepo.find({
      where: { nurse_order_id: id, nurse_id: nurse === null ? null : nurse.id },
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

  async acceptOffer(id: string) {
    const offer = await this.nurseOfferRepo.findOne({
      where: { id },
    });
    offer.is_accepted = true;
    await this.nurseOfferRepo.save(offer);
    const nurse_order = await this.nurseOrderRepo.findOne({
      where: { id: offer.nurse_order_id },
    });

    nurse_order.nurse_id = offer.nurse_id;
    await this.nurseOrderRepo.save(nurse_order);
    const result = await this.getSingleOrder(offer.nurse_order_id);
    const nurse = await this.nurseRepo.findOne({
      where: { id: offer.nurse_id },
    });
    this.nurseOrderGateway.server.emit(
      `nurse-${nurse.user_id}`,
      plainToInstance(NurseOrderResponse, result),
    );
    return result;
  }
}
