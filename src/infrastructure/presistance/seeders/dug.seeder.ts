import { Injectable } from '@nestjs/common';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as ExcelJS from 'exceljs';
import * as fs from 'fs';
import { Specialization } from 'src/infrastructure/entities/doctor/specialization.entity';
import { DrugCategory } from 'src/infrastructure/entities/pharmacy/drug-category.entity';
import { Drug } from 'src/infrastructure/entities/pharmacy/drug.entity';

@Injectable()
export class drugSeeder implements Seeder {
  constructor(
    @InjectRepository(Drug)
    private readonly drugRepository: Repository<Drug>,
    @InjectRepository(DrugCategory)
    private readonly drugCategoryRepository: Repository<DrugCategory>,
  ) {}
  const;
  async seed(): Promise<any> {
    const medicines=[]
    const files = fs.readFileSync(
      './public/files/drug/Trade Names Till 9-3-2023.xlsx',
    );
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(files);
    const sheet = workbook.getWorksheet(1);


    sheet.eachRow({ includeEmpty: true }, async (row, rowNumber) => {
     medicines.push(row.getCell(1).value)
  });
  const category= await this.drugCategoryRepository.find({})
  for (let index = 0; index < medicines.length; index++) {
    await this.drugRepository.save(new Drug({ name: medicines[index],category_id:category[0].id }));
    
  }
  }
  
  async drop(): Promise<any> {
    return this.drugRepository.delete({});
  }
}
