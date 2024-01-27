import { OwnedEntity } from 'src/infrastructure/base/owned.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { PhOrderAttachments } from './ph-order-attachments.entity';
import { Drug } from './drug.entity';
import { PhReply } from './ph-reply.entity';

@Entity()
export class PhOrder extends OwnedEntity {
  @ManyToOne(() => User, (user) => user.ph_orders)
  user: User;

  @Column({ default: true })
  deliver_to_home: boolean;

  @Column()
  address: string;

  @Column({ type: 'simple-array', nullable: true })
  drugs: string[];

  @Column()
  category_id: string;
  @Column()
  notes: string;

  @Column({ type: 'simple-array', nullable: true })
  nearby_pharmacies: string[];

  @OneToMany(
    () => PhOrderAttachments,
    (phOrderAttachments) => phOrderAttachments.ph_order,
  )
  ph_order_attachments: PhOrderAttachments[];
  @OneToMany(() => PhReply, (phReply) => phReply.orders)
  ph_replies: PhReply[];
}
