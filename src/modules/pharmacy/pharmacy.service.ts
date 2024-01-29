import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Pharmacy } from 'src/infrastructure/entities/pharmacy/pharmacy.entity';
import { ImageManager } from 'src/integration/sharp/image.manager';
import { ILike, In, Like, Repository } from 'typeorm';
import { CreatePharamcyRequest } from './dto/request/create-pharamcy-request';
import { PharmacyAttachments } from 'src/infrastructure/entities/pharmacy/pharmacy-attachments.entity';
import * as fs from 'fs';
import {
  PhOrderAttachmentType,
  PharmacyAttachmentType,
} from 'src/infrastructure/data/enums/pharmacy-attachment-typs';
import { Request } from 'express';
import { DrugCategory } from 'src/infrastructure/entities/pharmacy/drug-category.entity';
import { FindDrugQuery } from './dto/request/find-drug-query';
import { Drug } from 'src/infrastructure/entities/pharmacy/drug.entity';
import { PhOrder } from 'src/infrastructure/entities/pharmacy/ph-order.entity';
import { makeOrderRequest } from './dto/request/make-order-request';
import { PhOrderAttachments } from 'src/infrastructure/entities/pharmacy/ph-order-attachments.entity';
import { Address } from 'src/infrastructure/entities/user/address.entity';
import { Role } from 'src/infrastructure/data/enums/role.enum';
import { PhOrderResponse } from './dto/respone/ph-order-response';
import { or } from 'sequelize';
import { toUrl } from 'src/core/helpers/file.helper';

@Injectable()
export class PharmacyService {
  constructor(
    @InjectRepository(DrugCategory)
    private drugCategoryRepository: Repository<DrugCategory>,
    @InjectRepository(PhOrder)
    private orderRepository: Repository<PhOrder>,
    @InjectRepository(Pharmacy)
    private pharmacyRepository: Repository<Pharmacy>,
    @InjectRepository(Drug)
    private drugRepository: Repository<Drug>,

    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(PhOrderAttachments)
    private orderAttachmentRepository: Repository<PhOrderAttachments>,
    @InjectRepository(PharmacyAttachments)
    private pharmacyAttachmentRepository: Repository<PharmacyAttachments>,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  async makeOrder(request: makeOrderRequest) {
    const ph_order = plainToInstance(PhOrder, {
      ...request,
      user_id: this.request.user.id,
    });

    const address = await this.addressRepository.findOne({
      where: {
        id: request.address_id,
      },
    });

    const nearby_pharmacies = await this.pharmacyRepository
      .createQueryBuilder('pharmacy')
      .select('pharmacy.*')
      .addSelect(
        `ST_Distance_Sphere(POINT(:longitude, :latitude), POINT(pharmacy.longitude, pharmacy.latitude)) as distance`,
      )
      .where(
        `ST_Distance_Sphere(POINT(:longitude, :latitude), POINT(pharmacy.longitude, pharmacy.latitude)) <= :radius`,
      )

      // .andWhere('pharmacy.categories LIKE %${categories}%', {
      //   categories: request.categories,
      // })

      .setParameters({
        latitude: address.latitude,
        longitude: address.longitude,
        radius: 10 * 1000,
      }) // Convert km to meters
      .orderBy('distance', 'ASC')
      .getRawMany();
    if (nearby_pharmacies.length == 0) {
      throw new BadRequestException('no nearby pharmacies');
    }
    ph_order.nearby_pharmacies = nearby_pharmacies.map(
      (pharmacy) => pharmacy.id,
    );
    await this.orderRepository.save(ph_order);

    if (request.attachments) {
      request.attachments.map((file) => {
        // check if image exists using fs
        const exists = fs.existsSync(file);
        if (!exists) throw new BadRequestException('file not found');
      });

      // save shipping order images
      const ph_order_attachments = request.attachments.map((file) => {
        // create shipping-images folder if not exists
        if (!fs.existsSync('storage/ph_order-attachments')) {
          fs.mkdirSync('storage/ph_order-attachments');
        }
        // store the future path of the image
        const newPath = file.replace('/tmp/', '/ph_order-attachments/');

        // use fs to move images
        return plainToInstance(PhOrderAttachments, {
          file: newPath,
          ph_order_id: ph_order.id,
          type: PhOrderAttachmentType.FILE,
        });
      });

      await this.orderAttachmentRepository.save(ph_order_attachments);
      request.attachments.map((image) => {
        const newPath = image.replace('/tmp/', '/ph_order-attachments/');
        fs.renameSync(image, newPath);
      });
    }

    if (request.voice_recording) {
      request.voice_recording.map((file) => {
        // check if image exists using fs
        const exists = fs.existsSync(file);
        if (!exists) throw new BadRequestException('file not found');
      });

      // save shipping order images
      const voice_recording = request.voice_recording.map((file) => {
        // create shipping-images folder if not exists
        if (!fs.existsSync('storage/ph_order-attachments')) {
          fs.mkdirSync('storage/ph_order-attachments');
        }
        // store the future path of the image
        const newPath = file.replace('/tmp/', '/ph_order-attachments/');

        // use fs to move images
        return plainToInstance(PhOrderAttachments, {
          file: newPath,
          ph_order_id: ph_order.id,
          type: PhOrderAttachmentType.VOICE,
        });
      });

      await this.orderAttachmentRepository.save(voice_recording);
      request.voice_recording.map((image) => {
        const newPath = image.replace('/tmp/', '/ph_order-attachments/');
        fs.renameSync(image, newPath);
      });
    }

    return ph_order;
  }
  async getDrugs(query: FindDrugQuery) {
    const drugs = await this.drugRepository.find({
      where: { category_id: query.category_id, name: Like(`%${query.name}%`) },
      take: 50,
    });
    return drugs;
  }

  async getDrugCategories() {
    return await this.drugCategoryRepository.find();
  }

  async addPharmacyInfo(request: CreatePharamcyRequest, user_id: string) {
    const pharmacy = plainToInstance(Pharmacy, { ...request, user_id });
    await this.pharmacyRepository.save(pharmacy);

    if (request.license_images) {
      request.license_images.split(',').map((file) => {
        // check if image exists using fs
        const exists = fs.existsSync(file);
        if (!exists) throw new BadRequestException('file not found');
      });

      // save shipping order images
      const license_images = request.license_images.split(',').map((file) => {
        // create shipping-images folder if not exists
        if (!fs.existsSync('storage/pharmacy-licsene')) {
          fs.mkdirSync('storage/pharmacy-licsene');
        }
        // store the future path of the image
        const newPath = file.replace('/tmp/', '/pharmacy-licsene/');

        // use fs to move images
        return plainToInstance(PharmacyAttachments, {
          file: newPath,
          pharmacy_id: pharmacy.id,
          type: PharmacyAttachmentType.LICENSE,
        });
      });

      await this.pharmacyAttachmentRepository.save(license_images);
      request.license_images.split(',').map((image) => {
        const newPath = image.replace('/tmp/', '/pharmacy-licsene/');
        fs.renameSync(image, newPath);
      });
    }

    if (request.logo_images) {
      request.logo_images.split(',').map((file) => {
        // check if image exists using fs
        const exists = fs.existsSync(file);
        if (!exists) throw new BadRequestException('file not found');
      });

      // save shipping order images
      const logo_images = request.logo_images.split(',').map((file) => {
        // create shipping-images folder if not exists
        if (!fs.existsSync('storage/pharmacy-logo')) {
          fs.mkdirSync('storage/pharmacy-logo');
        }
        // store the future path of the image
        const newPath = file.replace('/tmp/', '/pharmacy-logo/');

        // use fs to move images
        return plainToInstance(PharmacyAttachments, {
          file: newPath,
          pharmacy_id: pharmacy.id,
          type: PharmacyAttachmentType.LOGO,
        });
      });

      await this.pharmacyAttachmentRepository.save(logo_images);
      request.logo_images.split(',').map((image) => {
        const newPath = image.replace('/tmp/', '/pharmacy-logo/');
        fs.renameSync(image, newPath);
      });
    }
  }

  async getOrders() {
    const pharamcy = await this.pharmacyRepository.findOne({
      where: { user_id: this.request.user.id },
  
    });

    const orders = await this.orderRepository.find({
      where: this.request.user.roles.includes(Role.PHARMACY)
        ? { nearby_pharmacies: ILike(pharamcy.id) }
        : { user_id: this.request.user.id },
        relations: { ph_order_attachments: true },
    });

    const result = await Promise.all(
      orders.map(async (order) => {
        const drugs = await this.drugRepository.find({
          where: { id: In(order.drugs) },
        });
       order.ph_order_attachments=order.ph_order_attachments.map((attachment)=>{
         attachment.file=toUrl(attachment.file)
         return attachment
       })
        return plainToInstance(PhOrderResponse, {
          ...order,
          drugs: drugs,
        }, { excludeExtraneousValues: true });}));
    return result;
  }
}
