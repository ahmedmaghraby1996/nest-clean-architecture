import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
import { ReservationType } from 'src/infrastructure/data/enums/reservation-type';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Specialization } from '../doctor/specialization.entity';
import { ReservationAttachments } from './reservation-attachments.entity';
import { Doctor } from '../doctor/doctor.entity';
import { FamilyMember } from '../client/family-member.entity';
import { ReservationStatus } from 'src/infrastructure/data/enums/reservation-status.eum';
import { Offer } from './offers.entity';
import { OwnedEntity } from 'src/infrastructure/base/owned.entity';
import { User } from '../user/user.entity';
import { Client } from '../client/client.entity';
import { Exclude } from 'class-transformer';
import { Address } from '../user/address.entity';
import { Transaction } from '../wallet/transaction.entity';

@Entity()
export class Reservation extends OwnedEntity {
  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn()
  user: User;

  @Column({ type: 'float', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'float', precision: 10, scale: 6, nullable: true })
  longitude: number;


  @Column({ nullable: true })
  reservationType: ReservationType;

  @ManyToOne(
    () => Specialization,
    (specialization) => specialization.reservations,
  )
  @JoinColumn()
  specialization: Specialization;

  @Column()
  specialization_id: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: ReservationStatus.CREATED })
  status: ReservationStatus;

  @Column({ nullable: true })
  note: string;

  @Column({ nullable: true })
  end_date: Date;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @OneToMany(
    () => ReservationAttachments,
    (attachment) => attachment.reservation,
  )
  attachments: ReservationAttachments[];

  @Exclude()
  @Column({ type: 'simple-array', nullable: true })
  nearby_doctors: string[];

  @ManyToOne(() => Doctor, (doctor) => doctor.reservations)
  @JoinColumn()
  doctor: Doctor;
  @Column({ nullable: true })
  doctor_id?: string;

  @Column({ nullable: true })
  cancel_reason: string;

  @Column({ default: false })
  cancel_request: boolean;

  @ManyToOne(() => FamilyMember, (familyMember) => familyMember.reservations, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn()
  family_member: FamilyMember;
  @Column({ nullable: true })
  family_member_id?: string;

  @Column({ nullable: true })
  client_agora_token: string;

  @Column({ nullable: true })
  doctor_agora_token: string;

  @OneToMany(() => Offer, (offer) => offer.reservation)
  offers: Offer[];

  @Column({ nullable: true })
  start_day: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  start_time: number;

  @ManyToOne(() => Address, (address) => address.reservations)
  @JoinColumn()
  address: Address;
  @Column({ nullable: true })
  address_id: string;

  @Column({ length: 10, unique: true })
  number: string;
  @Column()
  is_urgent: boolean;

  constructor(data: Partial<Reservation>) {
    super();
    Object.assign(this, data);
  }
}
