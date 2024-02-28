import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
import { TransactionTypes } from 'src/infrastructure/data/enums/transaction-types';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Wallet } from './wallet.entity';
import { Reservation } from '../reservation/reservation.entity';

@Entity()
export class Transaction extends AuditableEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  amount: number;



  @Column({ default: TransactionTypes.OTHER })
  type: TransactionTypes;
  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @Column()
  receiver_id: string;

  @Column({ nullable: true })
  order_id: string;
  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;

  constructor(partial?: Partial<Transaction>) {
    super();
    Object.assign(this, partial);
  }
}
