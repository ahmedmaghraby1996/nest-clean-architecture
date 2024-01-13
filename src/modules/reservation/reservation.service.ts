import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { urgentReservationRequest } from './dto/requests/urgent_reservation_request';
import * as fs from 'fs';
import { plainToInstance } from 'class-transformer';
import { ReservationAttachments } from 'src/infrastructure/entities/reservation/reservation-attachments.entity';
import { EntityManager, ILike, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Reservation } from 'src/infrastructure/entities/reservation/reservation.entity';
import { Doctor } from 'src/infrastructure/entities/doctor/doctor.entity';
import { ReservationType } from 'src/infrastructure/data/enums/reservation-type';
import { Request } from 'express';
import { RtcRole, RtcTokenBuilder } from 'agora-access-token';
import { BaseUserService } from 'src/core/base/service/user-service.base';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from 'src/infrastructure/entities/reservation/offers.entity';
import { ReservationStatus } from 'src/infrastructure/data/enums/reservation-status.eum';
import { readEnv } from 'src/core/helpers/env.helper';
import { compeleteReservationRequest } from './dto/requests/compelete-reservation-request';
import { ReservationAttachmentType } from 'src/infrastructure/data/enums/reservation-attachment-type';
import {
  getCurrentDate,
  getCurrentHourAndMinutes,
} from 'src/core/helpers/service-related.helper';
import { AdditionalInfoService } from '../additional-info/additional-info.service';
import { DoctorAvaliablityRequest } from '../additional-info/dto/requests/doctor-availbility-request';
import { SechudedReservationRequest } from './dto/requests/scheduled-reservation-request';
import { Address } from 'src/infrastructure/entities/user/address.entity';
import { where } from 'sequelize';
import { boolean } from 'joi';
import { ReservationGateway } from 'src/integration/gateways/reservation.gateway';
import { ReservationResponse } from './dto/response/reservation-respone';
import { NotificationService } from '../notification/services/notification.service';
import { NotificationTypes } from 'src/infrastructure/data/enums/notification-types.enum';
import { NotificationEntity } from 'src/infrastructure/entities/notification/notification.entity';

@Injectable()
export class ReservationService extends BaseUserService<Reservation> {
  constructor(
    @InjectRepository(ReservationAttachments)
    private readonly reservtion_attachment_repository: Repository<ReservationAttachments>,
    @InjectRepository(Doctor)
    private readonly doctor_repository: Repository<Doctor>,
    @InjectRepository(Reservation)
    private readonly repository: Repository<Reservation>,
    @InjectRepository(Address)
    private readonly address_repository: Repository<Address>,
    @InjectRepository(Offer)
    private readonly offer_repository: Repository<Offer>,
    private readonly additionalInfoService: AdditionalInfoService,
    @Inject(REQUEST) request: Request,
    private readonly reservationGateway: ReservationGateway,
    @Inject(NotificationService)
    public readonly notificationService: NotificationService,
  ) {
    super(repository, request);
  }

  async urgentReservation(request: urgentReservationRequest) {
    const user_id = await super.currentUser.id;
    const reservation = new Reservation({ ...request, user_id: user_id });
    const address = await this.address_repository.findOneBy({
      id: request.address_id,
    });

    const nearby_doctors =
      request.reservationType == ReservationType.MEETING
        ? await this.doctor_repository
            .createQueryBuilder('doctor')
            .select('doctor.*')
            .addSelect(
              `ST_Distance_Sphere(POINT(:longitude, :latitude), POINT(doctor.longitude, doctor.latitude)) as distance`,
            )
            .where(
              `ST_Distance_Sphere(POINT(:longitude, :latitude), POINT(doctor.longitude, doctor.latitude)) <= :radius`,
            )
            .andWhere(`doctor.is_urgent_doctor=1`)
            .andWhere('doctor.is_busy=0')
            .andWhere(`doctor.specialization_id=:specialization_id`, {
              specialization_id: request.specialization_id,
            })
            .setParameters({
              latitude: address.latitude,
              longitude: address.longitude,
              radius: 10 * 1000,
            }) // Convert km to meters
            .orderBy('distance', 'ASC')
            .getRawMany()
        : await this.doctor_repository.find({
            where: {
              is_urgent_doctor: true,
              specialization_id: request.specialization_id,
              is_busy: false,
            },
          });

    if (nearby_doctors.length == 0)
      throw new BadRequestException('no availiable doctors');
    reservation.nearby_doctors = nearby_doctors.map((doctor) => doctor.id);
    const count = await this._repo
      .createQueryBuilder('reservation')
      .where('DATE(reservation.created_at) = CURDATE()')
      .getCount();
    reservation.number = generateOrderNumber(count);
    reservation.is_urgent = true;
    await this._repo.save(reservation);
    if (request.files) {
      request.files.map((file) => {
        // check if image exists using fs
        const exists = fs.existsSync(file);
        if (!exists) throw new BadRequestException('file not found');
      });

      // save shipping order images
      const files = request.files.map((file) => {
        // create shipping-images folder if not exists
        if (!fs.existsSync('storage/reservation-images')) {
          fs.mkdirSync('storage/reservation-images');
        }
        // store the future path of the image
        const newPath = file.replace('/tmp/', '/reservation-images/');

        // use fs to move images
        return plainToInstance(ReservationAttachments, {
          file: newPath,
          reservation_id: reservation.id,
        });
      });

      await this.reservtion_attachment_repository.save(files);
      request.files.map((image) => {
        const newPath = image.replace('/tmp/', '/reservation-images/');
        fs.renameSync(image, newPath);
      });
    }

    for (let index = 0; index < nearby_doctors.length; index++) {
      this.reservationGateway.server.emit(
        `urgent-reservation-${nearby_doctors[index].id}`,
        new ReservationResponse(await this.findOne(reservation.id)),
      );
      await this.notificationService.create(
        new NotificationEntity({
          user_id: nearby_doctors[index].user_id,
          url: nearby_doctors[index].user_id,
          type: NotificationTypes.RESERVATION,
          title_ar: 'حالة طارئة جديدة',
          title_en: 'new urgent case',
          text_ar: 'حالة طارئة جديدة',
          text_en: 'new urgent case',
        }),
      );
    }

    return reservation;
  }

  override async findOne(
    column: string | Partial<Reservation>,
  ): Promise<Reservation> {
    return await this._repo.findOne({
      where: {
        id: column as string,
      },
      relations: {
      
        address: true,
        doctor: { user: true, clinic: true },
        attachments: true,
        family_member: true,
        specialization: true,
        user: { client_info: true },
      },
    });
  }
  async generateRTCtoken(id: number,reservation_id:string) {
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + 3600;

    
    const token = RtcTokenBuilder.buildTokenWithUid(
      readEnv('AGORA_APP_ID') as unknown as string,
      readEnv('AGORA_APP_CERTIFICATE') as unknown as string,
      reservation_id,
      id,
      RtcRole.SUBSCRIBER,
      privilegeExpireTime
    );

    console.log(`ch-${reservation_id}`);
    console.log(token);
    return token;
  }

  async hasOffer(reservation_id: string, doctor_id: string) {
    const offer = await this.offer_repository.findOne({
      where: { reservation_id, doctor_id },
    });

    return offer == null ? false : true;
  }
  async acceptOffer(id: string) {
    const offer = await this.offer_repository.findOne({ where: { id: id } });

    const reservation = await this._repo.findOne({
      where: { id: offer.reservation_id },
      relations: {
        specialization: true,
        doctor: { user: { client_info: true } },
      },
    });
    if (reservation.status != ReservationStatus.CREATED)
      throw new BadRequestException('reservation already started');
    reservation.start_time = Number(getCurrentHourAndMinutes());
    reservation.start_day = getCurrentDate();
    offer.is_accepted = true;
    this.offer_repository.update(offer.id, offer);
    reservation.doctor_id = offer.doctor_id;
    reservation.end_date = new Date(new Date().getTime() + 20 * 60000);
    reservation.status = ReservationStatus.STARTED;
    if (reservation.reservationType != ReservationType.MEETING) {
      reservation.client_agora_token = await this.generateRTCtoken(
        1,
        reservation.id,
      );
    }
    const doctor = await this.doctor_repository.findOne({
      where: {
        id: reservation.doctor_id,
      },
    });
    reservation.doctor_agora_token = await this.generateRTCtoken(
     2,
      reservation.id,
    );
    doctor.is_busy = true;

    await this.doctor_repository.save(doctor);
    
    new NotificationEntity({
      user_id: doctor.user_id,
      url: doctor.user_id,
      type: NotificationTypes.RESERVATION,
      title_ar: 'تم الموافقه على عرضك',
      title_en: ' your offer has been approved',
      text_ar: 'تم الموافقه على عرضك',
      text_en: ' your offer has been approved',
    });
  

    const savedReservation = await this._repo.save(reservation);
    this.reservationGateway.server.emit(
      `urgent-reservation-${doctor.id}`,
      new ReservationResponse(await this.findOne(reservation.id)),
    );
    return savedReservation;
  }

  async getResevation(id: string) {
    return await this._repo.findOne({
      where: { id },
      relations: {
        doctor: { user: true ,clinic:true},
        user: { client_info: true },
        specialization: true,
        family_member: true,
      },
    });
  }

  async compeleteReservation(request: compeleteReservationRequest) {
    const reservation = await this._repo.findOne({ where: { id: request.id } });

    reservation.status = ReservationStatus.COMPLETED;

    if (request.files) {
      request.files.map((file) => {
        // check if image exists using fs
        const exists = fs.existsSync(file);
        if (!exists) throw new BadRequestException('file not found');
      });

      // save shipping order images
      const files = request.files.map((file) => {
        // create shipping-images folder if not exists
        if (!fs.existsSync('storage/reservation-images')) {
          fs.mkdirSync('storage/reservation-images');
        }
        // store the future path of the image
        const newPath = file.replace('/tmp/', '/reservation-images/');

        // use fs to move images
        return plainToInstance(ReservationAttachments, {
          file: newPath,
          reservation_id: request.id,
          type: ReservationAttachmentType.DOCTOR,
        });
      });

      await this.reservtion_attachment_repository.save(files);
      request.files.map((image) => {
        const newPath = image.replace('/tmp/', '/reservation-images/');
        fs.renameSync(image, newPath);
      });
    }
    const doctor = await this.doctor_repository.findOne({
      where: { id: reservation.doctor_id },
    });
    doctor.is_busy = false;
    await this.doctor_repository.save(doctor);

    new NotificationEntity({
      user_id: reservation.user_id,
      url: reservation.user_id,
      type: NotificationTypes.RESERVATION,
      title_ar: 'تم انتهاء الحجز',
      title_en: ' your reservation has ended',
      text_ar: 'تم انتهاء الحجز',
      text_en: ' your reservation has edned',
    });
    await this._repo.save(reservation);
    return reservation;
  }

  async scheduledReservation(request: SechudedReservationRequest) {
    const busyTimes = await this.additionalInfoService.getDoctorBusyTimes(
      new DoctorAvaliablityRequest({
        doctor_id: request.doctor_id,
        date: request.start_date,
      }),
    );
    const start_day = request.start_date.toISOString().split('T')[0];

    const start_time =
      request.start_date.getUTCHours() +
      request.start_date.getUTCMinutes() / 100;

    if (busyTimes.filter((e) => e == start_time).length > 0) {
      throw new BadRequestException('Doctor busy at this time');
    }
    const reservation = new Reservation({
      user_id: this.currentUser.id,
      ...request,
      start_day,
      start_time,
      end_date: new Date(request.start_date.getTime() + 20 * 60000),
    });
    const count = await this._repo
      .createQueryBuilder('reservation')
      .where('DATE(reservation.created_at) = CURDATE()')
      .getCount();
    reservation.number = generateOrderNumber(count);
    reservation.is_urgent = false;
    reservation.status = ReservationStatus.SCHEDULED;
    await this._repo.save(reservation);
    const doctor = await this.doctor_repository.findOne({
      where: { id: request.doctor_id },
    });
    await this.notificationService.create(
      new NotificationEntity({
        user_id: doctor.user_id,
        url: doctor.user_id,
        type: NotificationTypes.RESERVATION,
        title_ar: 'لديك حجز جديد',
        title_en: 'you have a new reservation',
        text_ar: 'لديك حجز جديد',
        text_en: 'you have a new reservation',
      }),
    );
    return this.getResevation(reservation.id);
  }

  async startReservation(id: string) {
    const reservation = await this._repo.findOne({
      where: { id },
    });
    if (reservation.status == ReservationStatus.SCHEDULED) {
      reservation.status = ReservationStatus.STARTED;
      reservation.client_agora_token = await this.generateRTCtoken(
        1,
        reservation.id,
      );

      const doctor = await this.doctor_repository.findOne({
        where: { id: reservation.doctor_id },
      });
      reservation.doctor_agora_token = await this.generateRTCtoken(
       2,
        reservation.id,
      );
      doctor.is_busy = true;
      await this.doctor_repository.save(doctor);

      new NotificationEntity({
        user_id: reservation.user_id,
        url: reservation.user_id,
        type: NotificationTypes.RESERVATION,
        title_ar: 'تم بدأ الحجز',
        title_en: ' your reservation has started',
        text_ar: 'تم بدأ الحجز',
        text_en: ' your reservation has started',
      });
      return await this._repo.save(reservation);
    }
  }
}

export const generateOrderNumber = (count: number) => {
  // number of digits matches ##-**-@@-&&&&, where ## is 100 - the year last 2 digits, ** is 100 - the month, @@ is 100 - the day, &&&& is the number of the order in that day
  const date = new Date();
  const year = date.getFullYear().toString().substr(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  // order number is the count of orders created today + 1 with 4 digits and leading zeros
  const orderNumber = (count + 1).toString().padStart(4, '0');
  return `${100 - parseInt(year)}${100 - parseInt(month)}${
    100 - parseInt(day)
  }${orderNumber}`;
};
