import { Column, Entity, ManyToOne } from "typeorm";
import { Reservation } from "./reservation.entity";
import { AuditableEntity } from "src/infrastructure/base/auditable.entity";
import { ReservationAttachmentType } from "src/infrastructure/data/enums/reservation-attachment-type";


@Entity()
export class ReservationAttachments extends AuditableEntity{
    
 @Column()
 file:string
 @Column({default:ReservationAttachmentType.CLIENT})
 type:ReservationAttachmentType 
 


 @ManyToOne(()=>Reservation,reservation=>reservation.attachments)
 reservation:Reservation

 @Column()
 reservation_id:string

 constructor(data:Partial<ReservationAttachments>){
     
     super()
     Object.assign(this,data)
 }
}