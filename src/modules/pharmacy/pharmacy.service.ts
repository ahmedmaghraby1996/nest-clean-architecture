import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Pharmacy } from 'src/infrastructure/entities/pharmacy/pharmacy.entity';
import { ImageManager } from 'src/integration/sharp/image.manager';
import { Repository } from 'typeorm';
import { CreatePharamcyRequest } from './dto/request/create-pharamcy-request';
import { PharmacyAttachments } from 'src/infrastructure/entities/pharmacy/pharmacy-attachments.entity';
import * as fs from 'fs';
import { PharmacyAttachmentType } from 'src/infrastructure/data/enums/pharmacy-attachment-typs';
import { Request } from 'express';
import { DrugCategory } from 'src/infrastructure/entities/pharmacy/drug-category.entity';
@Injectable()
export class PharmacyService {
  constructor(
    @InjectRepository(DrugCategory)
    private drugCategoryRepository: Repository<DrugCategory>,
    @InjectRepository(Pharmacy)
    private pharmacyRepository: Repository<Pharmacy>,
    @InjectRepository(PharmacyAttachments)
    private pharmacyAttachmentRepository: Repository<PharmacyAttachments>,
    @Inject(REQUEST) private readonly request: Request,
   
  
  ) {}




  async getDrugCategories() {
    return await this.drugCategoryRepository.find();
  }

  async addPharmacyInfo(request: CreatePharamcyRequest, user_id: string) {
    const pharmacy = plainToInstance(Pharmacy, {...request,user_id});
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





}
