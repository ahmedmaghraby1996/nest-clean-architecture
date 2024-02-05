import { OwnedEntity } from 'src/infrastructure/base/owned.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { User } from '../user/user.entity';
import { NurseOffer } from './nurse-offer.entity';
@Entity()
export class Nurse extends OwnedEntity {
  @OneToOne(() => User)
  user: User;

  @OneToMany(() => NurseOffer, (offer) => offer.nurse)
  offers: NurseOffer[];
  @Column({ default: false })
  is_verified: boolean;

  @Column()
  experience: number;

  @Column({ type: 'text' })
  summary: string;

  @Column()
  license_img: string;
}
