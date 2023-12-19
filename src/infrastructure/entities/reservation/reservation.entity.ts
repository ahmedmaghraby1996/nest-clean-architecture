import { AuditableEntity } from "src/infrastructure/base/auditable.entity";
import { ReservationType } from "src/infrastructure/data/enums/reservation-type";
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Specialization, } from "../doctor/specialization.entity";
import { ReservationAttachments } from "./reservation-attachments.entity";
import { Doctor } from "../doctor/doctor.entity";

@Entity()
export class Reservation extends AuditableEntity{

@Column({nullable:true})
reservationType: ReservationType;

@ManyToOne(()=>Specialization,specialization=>specialization.reservations)
specialization:Specialization

@Column()
specialization_id:string

@Column()
phone:string

@Column()
note:string

@OneToMany(()=>ReservationAttachments,attachment=>attachment.reservation)
attachments:ReservationAttachments[]    


@Column({ type: 'json', nullable: true })
nearby_doctors: string[];



@ManyToOne(() => Doctor, (doctor) => doctor.reservations)
doctor: Doctor;
@Column({ nullable: true })
doctor_id?: string;


constructor(data: Partial<Reservation>)
{
    super();
    Object.assign(this, data);
}

}