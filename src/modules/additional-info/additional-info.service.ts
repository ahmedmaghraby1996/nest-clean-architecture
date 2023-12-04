import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DoctorInfoRequest } from './dto/requests/doctor-info-request';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from 'src/infrastructure/entities/doctor/doctor.entity';
import { EntityManager, In, Repository } from 'typeorm';
import * as fs from 'fs';
import { DoctorLicense } from 'src/infrastructure/entities/doctor/doctor-license.entity';
import { plainToInstance } from 'class-transformer';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Specialization } from 'src/infrastructure/entities/doctor/specialization.entity';
@Injectable()
export class AdditionalInfoService {
  constructor(
    @InjectRepository(Doctor) private readonly doctorRepo: Repository<Doctor>,
    @InjectRepository(Specialization) private readonly specializationRepo: Repository<Specialization>,
    private readonly context: EntityManager,
    @Inject(REQUEST) private readonly request: Request,
  ) {}


  async getSpecilizations() {

    return await this.specializationRepo.find();
  }
  async addDoctorInfo(request: DoctorInfoRequest) {


    const doctor= await this.getDoctor();

    doctor.year_of_experience=request.year_of_experience
    doctor.has_clinc=request.has_clinc
    if(request.latitude && request.longitude){ 
    doctor.latitude=Number(request.latitude),
    doctor.longitude=Number(request.longitude)}
    
    if(request.specializations){
      const specializations= await this.context.find(Specialization,{where:{id: In(request.specializations)  }})
      

     doctor.specializations=specializations;
     console.log(doctor);
    }
if(request.license_images){
    request.license_images.map((image) => {
      // check if image exists using fs
      const exists = fs.existsSync(image);
      if (!exists) throw new BadRequestException('Image not found');
    });

    // save shipping order images
    const images = request.license_images.map((image) => {
      // create shipping-images folder if not exists
      if (!fs.existsSync('storage/license-images')) {
        fs.mkdirSync('storage/license-images');
      }
      // store the future path of the image
      const newPath = image.replace('/tmp/', '/license-images/');

      console.log(newPath)
      // use fs to move images
      return plainToInstance(DoctorLicense, {
        image: newPath,
        doctor_id: doctor.id,
      });
    });
    console.log(images);
    await this.context.save(images);
    request.license_images.map((image) => {
      const newPath = image.replace('/tmp/', '/license-images/');
      fs.renameSync(image, newPath);
    });}
    return  await this.doctorRepo.save(doctor);

  }

 async  getDoctor(){
  console.log(this.request.user);

   return await this.doctorRepo.findOneBy({user_id:this.request.user.id})


  }
}
