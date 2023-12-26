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
@Injectable()
export class ReservationService  extends BaseUserService<Reservation> {
constructor(
  @InjectRepository(ReservationAttachments) private readonly reservtion_attachment_repository: Repository<ReservationAttachments>,
  @InjectRepository(Doctor) private readonly doctor_repository: Repository<Doctor>,
    @InjectRepository(Reservation) private readonly repository: Repository<Reservation>,
    @Inject(REQUEST)  request: Request,
){super(repository,request)}


 async urgentReservation(request:urgentReservationRequest){

  const user_id= await super.currentUser.id
    const reservation= new Reservation({...request,user_id:user_id});

   
  
    const nearby_doctors= request.reservationType==ReservationType.MEETING?
    await this.doctor_repository
  .createQueryBuilder('doctor')
  .select('doctor.*')
  .addSelect(`ST_Distance_Sphere(POINT(:longitude, :latitude), POINT(doctor.longitude, doctor.latitude)) as distance`)
  .where(`ST_Distance_Sphere(POINT(:longitude, :latitude), POINT(doctor.longitude, doctor.latitude)) <= :radius`)
  .andWhere(`doctor.is_urgent_doctor=1`)
  .andWhere(`doctor.specialization_id=:specialization_id`,{specialization_id:request.specialization_id})
  .setParameters({ latitude: request.latitude, longitude: request.longitude, radius: 10 * 1000 }) // Convert km to meters
  .orderBy('distance', 'ASC')
  .getRawMany()
    
    
    
    :
    await this.doctor_repository.find({
        where:{is_urgent_doctor:true,specialization_id:request.specialization_id}
        
    })
    console.log(nearby_doctors)
if (nearby_doctors.length==0)
throw  new BadRequestException('no availiable doctors')
   reservation.nearby_doctors=nearby_doctors.map((doctor)=>doctor.id) 
await this._repo.save(reservation)   
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
    await this.generateRTCtoken(user_id)
    return reservation;
}


    async generateRTCtoken( id :string){


const       token = RtcTokenBuilder.buildTokenWithAccount("475c63fb30dc481f92b68be21db9c3d9", "b9f9c98e77964f16b239cbc05436148e", "name", id, RtcRole.SUBSCRIBER, 3600);
    

console.log(token)


}}

