import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { PhOrder } from './ph-order.entity';
import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
import { PhOrderReplyType } from 'src/infrastructure/data/enums/pharmacy-attachment-typs';
import { Pharmacy } from './pharmacy.entity';

@Entity()
export class PhReply extends AuditableEntity {
  @ManyToOne(() => PhOrder, (order) => order.ph_replies)
  order: PhOrder;
  @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.replies)
  @JoinColumn({ name: 'pharmacy_id' })
  pharmacy: Pharmacy;
  @Column()
  pharmacy_id: string;

  @Column()
  order_id: string;

  @Column({ nullable: true })
  note: string;

  @Column()
  price: string;
  @Column()
  address: string;
  @Column()
  phone: string;
  @Column()
  availability: PhOrderReplyType;
}
