import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Nurse } from './nurse.entity';
import { NurserOrder as NurseOrder } from './nurse-order.entity';

@Entity()
export class NurseOffer extends AuditableEntity {
  @ManyToOne(() => Nurse, (nurse) => nurse.offers)
  @JoinColumn()
  nurse: Nurse;
  @Column()
  nurse_id: string;

  @ManyToOne(() => NurseOrder, (nurserOrder) => nurserOrder.offers)
  nurse_order: NurseOrder;
  @Column()
  nurse_order_id: string;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  value: number;

  @Column({ default: false })
  is_accepted: boolean;

  @Column({ nullable: true })
  notes: string;
}
