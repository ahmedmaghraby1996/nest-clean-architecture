import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { OwnedEntity } from 'src/infrastructure/base/owned.entity';
import { DoctorLicense } from './doctor-license.entity';
import { Reservation } from '../reservation/reservation.entity';
import { Specialization } from './specialization.entity';
import Decimal from 'decimal.js';

@Entity()
export class Doctor extends OwnedEntity {
 
  @OneToOne(() => User,{onDelete:"CASCADE"})
  @JoinColumn({})
  user: User;

  @Column({nullable:true})
  year_of_experience: number;

  @OneToMany(() => DoctorLicense, (license) => license.doctor)
  licenses: DoctorLicense[];

  @ManyToOne(()=>Specialization,spec=>spec.doctors)
  @JoinTable()
  specialization:Specialization

  @Column({nullable:true})
  specialization_id:string

  @OneToMany(() => Reservation, (reservation) => reservation.doctor)
  reservations: Reservation[];

@Column({nullable:true})
  has_clinc:boolean;

  
@Column({nullable:true})
summery:string;

 
 @Column({ type: 'float', precision: 10, scale: 6 ,nullable:true})
 latitude: number;
 
 @Column({ type: 'float', precision: 10, scale: 6 ,nullable:true})
 longitude: number;


 @Column({ type: 'float', precision: 10, scale: 6 ,nullable:true})
 clinc_latitude: number;
 
 @Column({ type: 'float', precision: 10, scale: 6 ,nullable:true})
 clinc_longitude: number;

 @Column({nullable:true})
 is_verified:boolean;


 @Column({nullable:true,type:"decimal",precision:10,scale:2})
Video_consultation_price:number;


@Column({nullable:true,type:"decimal",precision:10,scale:2})
voice_consultation_price:number;

@Column({nullable:true,type:"decimal",precision:10,scale:2})
home_consultation_price:number;


 
 @Column({nullable:true})
 is_urgent_doctor:boolean;




constructor( data:Partial<Doctor>){
  super();
  Object.assign(this,data);
}
 

}
