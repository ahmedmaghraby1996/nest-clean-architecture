import { OwnedEntity } from 'src/infrastructure/base/owned.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { PhOrderAttachments } from './ph-order-attachments.entity';
import { Drug } from './drug.entity';
import { PhReply } from './ph-reply.entity';
import { Address } from '../user/address.entity';
import { PhOrderStatus } from 'src/infrastructure/data/enums/pharmacy-attachment-typs';

@Entity()
export class PhOrder extends OwnedEntity {
  @ManyToOne(() => User, (user) => user.ph_orders)
  user: User;

  @ManyToOne(() => Address, (address) => address.ph_orders)
  address: Address;
  @Column({nullable:true})
  address_id: string;

  @Column({default:PhOrderStatus.PENDING})
  status:PhOrderStatus

  @Column({ type: 'simple-array', nullable: true })
  drugs: string[];


  @Column()
  notes: string;

  @Column({ type: 'simple-array', nullable: true })
  nearby_pharmacies: string[];

  @OneToMany(
    () => PhOrderAttachments,
    (phOrderAttachments) => phOrderAttachments.ph_order,
  )
  ph_order_attachments: PhOrderAttachments[];
  @OneToMany(() => PhReply, (phReply) => phReply.order)
  ph_replies: PhReply[];
}
