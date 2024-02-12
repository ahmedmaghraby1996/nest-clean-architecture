import { OwnedEntity } from 'src/infrastructure/base/owned.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { NurseOffer } from './nurse-offer.entity';
import { NurseLicense } from './nurse-license.entity';
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

  @OneToMany(() => NurseLicense, (license) => license.nurse)
  license_images: NurseLicense[];


  
}
