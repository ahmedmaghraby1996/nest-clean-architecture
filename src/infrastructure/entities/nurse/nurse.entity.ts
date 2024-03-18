import { OwnedEntity } from 'src/infrastructure/base/owned.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { NurseLicense } from './nurse-license.entity';

@Entity()
export class Nurse extends OwnedEntity {
  @OneToOne(() => User,{onDelete:'CASCADE'})
  @JoinColumn({},)
  user: User;


  @Column({ default: false })
  is_verified: boolean;

  @Column()
  experience: number;
  @Column({ type: 'text' })
  summary: string;
  @Column({ default: 0, type: 'decimal', precision: 10, scale: 2 })
  rating: number;
  @Column({ default: 0 })
  number_of_reviews: number;


  @OneToMany(() => NurseLicense, (license) => license.nurse)
  license_images: NurseLicense[];



  
}
