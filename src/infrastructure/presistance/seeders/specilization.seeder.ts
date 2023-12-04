import { Injectable } from '@nestjs/common';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as fs from 'fs';
import { Specialization } from 'src/infrastructure/entities/doctor/specialization.entity';


@Injectable()
export class SpecializationSeeder implements Seeder {
  constructor(
    @InjectRepository(Specialization)
    private readonly specializationRepository: Repository<Specialization>,
  ) {}

  async seed(): Promise<any> {
    //* load data from json Color file
    const dataColor = fs.readFileSync('./json/specilizations.json', 'utf8');
    const data = JSON.parse(dataColor);
    const dataEntity = this.specializationRepository.create(data["specializations"]);

    //* save AboutUs entities in database
    return await this.specializationRepository.save(dataEntity);
  }

  async drop(): Promise<any> {
    return this.specializationRepository.delete({});
  }
}
