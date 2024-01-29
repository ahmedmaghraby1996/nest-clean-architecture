import { cp } from 'fs';
import { OwnedEntity } from 'src/infrastructure/base/owned.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';

import { PharmacyAttachments } from './pharmacy-attachments.entity';
import { PhReply } from './ph-reply.entity';
import { User } from '../user/user.entity';

@Entity()
export class Pharmacy extends OwnedEntity {

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({})
  user: User;

  @Column()
  ph_name: string;

  @Column()
  open_time: string;

  @Column()
  close_time: string;

  @Column()
  expierence: number;

  @Column({ type: 'text' })
  summery: string;

  @Column({type:'text',nullable:true})
  address: string;

  @Column({ type: 'float', precision: 10, scale: 6, nullable: true })
  latitude: number;

  @Column({ type: 'float', precision: 10, scale: 6, nullable: true })
  longitude: number;

  @OneToMany(() => PhReply, (phReply) => phReply.pharmacy)
  replies: PhReply[];

  @Column({ type: 'simple-array', nullable: true })
  categories: string[];

  @OneToMany(() => PharmacyAttachments, (attachment) => attachment.pharmacy)
  attachments: PharmacyAttachments[];
}
