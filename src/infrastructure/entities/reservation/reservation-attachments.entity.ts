import { Column, Entity, ManyToOne } from "typeorm";
import { Reservation } from "./reservation.entity";
import { AuditableEntity } from "src/infrastructure/base/auditable.entity";


@Entity()
export class ReservationAttachments extends AuditableEntity{
    
 @Column()
 file:string
 
 @Column()
 type:string


 @ManyToOne(()=>Reservation,reservation=>reservation.attachments)
 reservation:Reservation

 @Column()
 reservation_id:string

 constructor(data:Partial<ReservationAttachments>){
     
     super()
     Object.assign(this,data)
 }
}