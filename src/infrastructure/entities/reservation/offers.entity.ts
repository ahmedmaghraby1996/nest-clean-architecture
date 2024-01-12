import { AuditableEntity } from "src/infrastructure/base/auditable.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Reservation } from "./reservation.entity";
import { Doctor } from "../doctor/doctor.entity";
@Entity()
export class Offer extends AuditableEntity{

@ManyToOne(()=>Doctor,doctor=>doctor.offers)
@JoinColumn()
doctor:Doctor;

@Column()
doctor_id:string
@ManyToOne(()=>Reservation,reservation=>reservation.offers)
reservation:Reservation;


@Column()
reservation_id:string;

@Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
value:number;

@Column({default:false})
is_accepted:boolean

constructor(data:Partial<Offer>){
    super()
    Object.assign(this,data)
}
}