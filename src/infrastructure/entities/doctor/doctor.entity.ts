import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { OwnedEntity } from 'src/infrastructure/base/owned.entity';
import { DoctorLicense } from './doctor-license.entity';
import { Reservation } from '../reservation/reservation.entity';
import { Specialization } from './specialization.entity';

@Entity()
export class Doctor extends OwnedEntity {
  @Column()
  name: string;
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column()
  year_of_experience: number;

  @OneToMany(() => DoctorLicense, (license) => license.doctor)
  licenses: DoctorLicense[];

  @ManyToMany(()=>Specialization,spec=>spec.doctors)
  @JoinTable()
  specializations:Specialization[]

  @OneToMany(() => Reservation, (reservation) => reservation.doctor)
  reservations: Reservation[];
}
