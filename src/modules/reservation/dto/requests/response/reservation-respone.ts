import { Expose, plainToInstance } from "class-transformer";
import { toUrl } from "src/core/helpers/file.helper";
import { ReservationStatus } from "src/infrastructure/data/enums/reservation-status.eum";
import { ReservationType } from "src/infrastructure/data/enums/reservation-type";
import { Doctor } from "src/infrastructure/entities/doctor/doctor.entity";
import { Specialization } from "src/infrastructure/entities/doctor/specialization.entity";
import { ReservationAttachments } from "src/infrastructure/entities/reservation/reservation-attachments.entity";
import { Reservation } from "src/infrastructure/entities/reservation/reservation.entity";

export class ReservationResponse {

@Expose()
id:string
@Expose()
    reservationType: ReservationType;
    @Expose()
    specialization:Specialization
    

    @Expose()
    phone:string
    @Expose()

    status:ReservationStatus
    @Expose()
 
    note:string
    
    @Expose()
    attachments:any    
    
    @Expose()
    doctor: any;
    
    
    @Expose()
    family_member: any;
    

    constructor(data: Partial<ReservationResponse>){
        this.id=data.id
       this.note=data.note
       this.phone=data.phone 
       this.status=data.status
       this.reservationType=data.reservationType
       this.specialization=data.specialization
       this.attachments=data.attachments.map((e)=>{e.file= toUrl(e.file); return e.file})


this.doctor= data.doctor? {
    id:data.doctor.id,name:data.doctor.user.first_name+' '+data.doctor.user.last_name  }:null


this.family_member= data.family_member?{id:data.family_member.id ,name:data.family_member.first_name,height:data.family_member.height,weight:data.family_member.weight,kinship:data.family_member.kinship}   :null

}
     
    
    

}   