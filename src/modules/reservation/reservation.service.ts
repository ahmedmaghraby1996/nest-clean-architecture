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

@Injectable()
export class ReservationService extends BaseUserService<Reservation> {
  constructor(
    @InjectRepository(ReservationAttachments)
    private readonly reservtion_attachment_repository: Repository<ReservationAttachments>,
    @InjectRepository(Doctor)
    private readonly doctor_repository: Repository<Doctor>,
    @InjectRepository(Reservation)
    private readonly repository: Repository<Reservation>,
    @InjectRepository(Offer)
    private readonly offer_repository: Repository<Offer>,
    @Inject(REQUEST) request: Request,
  ) {
    super(repository, request);
  }

  async urgentReservation(request: urgentReservationRequest) {
    const user_id = await super.currentUser.id;
    const reservation = new Reservation({ ...request, user_id: user_id });

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
            .andWhere(`doctor.specialization_id=:specialization_id`, {
              specialization_id: request.specialization_id,
            })
            .setParameters({
              latitude: request.latitude,
              longitude: request.longitude,
              radius: 10 * 1000,
            }) // Convert km to meters
            .orderBy('distance', 'ASC')
            .getRawMany()
        : await this.doctor_repository.find({
            where: {
              is_urgent_doctor: true,
              specialization_id: request.specialization_id,
            },
          });

    if (nearby_doctors.length == 0)
      throw new BadRequestException('no availiable doctors');
    reservation.nearby_doctors = nearby_doctors.map((doctor) => doctor.id);
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

        console.log(newPath);
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

    return reservation;
  }

  async generateRTCtoken(id: string) {
    const token = RtcTokenBuilder.buildTokenWithAccount(
      readEnv('AGORA_APP_ID') as unknown as string,
      readEnv('AGORA_APP_CERTIFICATE') as unknown as string,
      `ch-${id}`,
      id,
      RtcRole.SUBSCRIBER,
      15 * 60 * 60 * 1000,
    );

    return token;
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
    offer.is_accepted = true;
    this.offer_repository.save(offer);
    reservation.doctor_id = offer.doctor_id;
    reservation.end_date = new Date(new Date().getTime() + 20 * 60000);
    reservation.status = ReservationStatus.ACCEPTED;
    if (reservation.reservationType != ReservationType.MEETING) {
      reservation.agora_token = await this.generateRTCtoken(
        this.currentUser.id,
      );
    }
    return await this._repo.save(reservation);
  }

  async getResevation(id: string) {
    return await this._repo.findOne({
      where: { id },
      relations: {
        doctor: { user: true },
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

        console.log(newPath);
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

    this._repo.save(reservation);
    return reservation;
  }
}
