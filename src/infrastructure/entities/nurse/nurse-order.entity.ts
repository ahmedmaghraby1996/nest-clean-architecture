import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Address } from '../user/address.entity';
import { OwnedEntity } from 'src/infrastructure/base/owned.entity';
import { NurseOffer } from './nurse-offer.entity';

@Entity()
export class NurserOrder extends OwnedEntity {
  @ManyToOne(() => User,(user) => user.nurse_orders)
  user: User;

  @ManyToOne(() => Address,  (address) => address.nurse_orders)
  address: Address;
  @Column()
  address_id: string;
  @Column({ nullable: true })
  notes: string;
  @Column()
  date_from: Date;
  @Column()
  date_to: Date;
  @OneToMany(() => NurseOffer, (offer) => offer.nurse)
  offers: NurseOffer[]
}
