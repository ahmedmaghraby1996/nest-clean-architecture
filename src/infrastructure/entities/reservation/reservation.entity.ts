import { AuditableEntity } from "src/infrastructure/base/auditable.entity";
import { ReservationType } from "src/infrastructure/data/enums/reservation-type";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { Specialization, } from "../doctor/specialization.entity";
import { ReservationAttachments } from "./reservation-attachments.entity";
import { Doctor } from "../doctor/doctor.entity";
import { FamilyMember } from "../client/family-member.entity";
import { ReservationStatus } from "src/infrastructure/data/enums/reservation-status.eum";
import { Offer } from "./offers.entity";
import { OwnedEntity } from "src/infrastructure/base/owned.entity";
import { User } from "../user/user.entity";
import { Client } from "../client/client.entity";

@Entity()
export class Reservation extends OwnedEntity{

@Column({nullable:true})
reservationType: ReservationType;

@ManyToOne(()=>Specialization,specialization=>specialization.reservations)
@JoinColumn()
specialization:Specialization

@Column()
specialization_id:string

@Column()
phone:string

@Column({default:ReservationStatus.CREATED})
status:ReservationStatus

@Column()
note:string

@OneToMany(()=>ReservationAttachments,attachment=>attachment.reservation)
attachments:ReservationAttachments[]    


@Column({ type: 'simple-array', nullable: true })
nearby_doctors: string[];



@ManyToOne(() => Doctor, (doctor) => doctor.reservations)
@JoinColumn()
doctor: Doctor;
@Column({ nullable: true })
doctor_id?: string;

@ManyToOne(()=>FamilyMember,familyMember=>familyMember.reservations,{cascade:true,nullable:true})
@JoinColumn()
family_member:FamilyMember
@Column({ nullable: true })
family_member_id?: string;

@ManyToOne(()=>Client,client=>client.reservations,{cascade:true})
@JoinColumn()
client:Client
@Column({ nullable: true })
client_id?: string;

@OneToMany(()=>Offer,offer=>offer.reservation)
 offers:Offer[]        



constructor(data: Partial<Reservation>)
{
    super();
    Object.assign(this, data);
}

}