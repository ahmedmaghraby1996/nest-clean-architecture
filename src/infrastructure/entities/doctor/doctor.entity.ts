import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { OwnedEntity } from 'src/infrastructure/base/owned.entity';
import { DoctorLicense } from './doctor-license.entity';
import { Reservation } from '../reservation/reservation.entity';
import { Specialization } from './specialization.entity';

@Entity()
export class Doctor extends OwnedEntity {
 
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column({nullable:true})
  year_of_experience: number;

  @OneToMany(() => DoctorLicense, (license) => license.doctor)
  licenses: DoctorLicense[];

  @ManyToMany(()=>Specialization,spec=>spec.doctors)
  @JoinTable()
  specializations:Specialization[]

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
 @Column({nullable:true})
 urgent_doctor:boolean;


constructor( data:Partial<Doctor>){
  super();
  Object.assign(this,data);
}
 

}
