import { OwnedEntity } from 'src/infrastructure/base/owned.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { NurseOffer } from './nurse-offer.entity';
import { NurseLicense } from './nurse-license.entity';
import { NurseOrder } from './nurse-order.entity';
@Entity()
export class Nurse extends OwnedEntity {
  @OneToOne(() => User,{onDelete:'CASCADE'})
  @JoinColumn({},)
  user: User;

  @OneToMany(() => NurseOffer, (offer) => offer.nurse)
  offers: NurseOffer[];
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


  @OneToMany(() => NurseOrder, (order) => order.nurse)
  orders: NurseOrder[];
  
}
