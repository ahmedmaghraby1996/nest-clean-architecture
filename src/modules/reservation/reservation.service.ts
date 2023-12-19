import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { urgentReservationRequest } from './dto/requests/urgent_reservation_request';
import * as fs from 'fs';
import { plainToInstance } from 'class-transformer';
import { ReservationAttachments } from 'src/infrastructure/entities/reservation/reservation-attachments.entity';
import { EntityManager } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Reservation } from 'src/infrastructure/entities/reservation/reservation.entity';
import { Doctor } from 'src/infrastructure/entities/doctor/doctor.entity';
import { ReservationType } from 'src/infrastructure/data/enums/reservation-type';
import { Request } from 'express';
import { RtcRole, RtcTokenBuilder } from 'agora-access-token';
@Injectable()
export class ReservationService {
constructor(
    private readonly context: EntityManager,
    @Inject(REQUEST) private readonly request: Request,
){}


 async urgentReservation(request:urgentReservationRequest){


    const reservation= new Reservation(request);

    const user_id= await this.request.user.id
  
    const nearby_doctors= request.reservationType==ReservationType.MEETING?
    await this.context
  .createQueryBuilder(Doctor,'doctor')
  .select('doctor.*')
  .addSelect(`ST_Distance_Sphere(POINT(:longitude, :latitude), POINT(doctor.longitude, doctor.latitude)) as distance`)
  .where(`ST_Distance_Sphere(POINT(:longitude, :latitude), POINT(doctor.longitude, doctor.latitude)) <= :radius`)
  
  .setParameters({ latitude: request.latitude, longitude: request.longitude, radius: 10 * 1000 }) // Convert km to meters
  .orderBy('distance', 'ASC')
  .getRawMany()
    
    
    
    :
    await this.context.find(Doctor,{
        where:{is_urgent_doctor:true}
        
    })

   reservation.nearby_doctors=nearby_doctors.map((doctor)=>doctor.id) 
await this.context.save(reservation)   
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
  
        await this.context.save(files);
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
