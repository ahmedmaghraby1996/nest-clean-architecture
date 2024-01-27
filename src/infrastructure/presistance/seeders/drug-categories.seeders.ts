import { Injectable } from '@nestjs/common';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as fs from 'fs';
import { Specialization } from 'src/infrastructure/entities/doctor/specialization.entity';
import { DrugCategory } from 'src/infrastructure/entities/pharmacy/drug-category.entity';

@Injectable()
export class drugCategorySeeder implements Seeder {
  constructor(
    @InjectRepository(DrugCategory)
    private readonly drugCategoryRepository: Repository<DrugCategory>,
  ) {}

  async seed(): Promise<any> {

    const name_ar=["الادوية","مستحضرات تحميل","مستلزمات طبية"]
    const name_en=["medicines","Cosmetic","Medical supplies"]
    for (let index = 0; index < name_ar.length; index++) {
        
      await this.drugCategoryRepository.save(
        new DrugCategory({ name_ar: name_ar[index], name_en: name_en[index] }),
      );
    }
  }

  async drop(): Promise<any> {
    return  this.drugCategoryRepository.delete({});
  }
}
