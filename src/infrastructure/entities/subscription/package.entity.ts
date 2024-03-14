import { BaseEntity } from 'src/infrastructure/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Subscription } from './subscription.entity';
@Entity()
export class Package extends BaseEntity {
  @Column()
  name_ar: string;

  @Column()
  name_en: string;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  price: number;

  @Column()
  expiration_days: number;

  @Column({ nullable: true })
  description_ar: string;

  @Column()
  number_of_pharmacy_order: number;

  @OneToMany(() => Subscription, (subscription) => subscription.package)
  subscriptions: Subscription[];
}
