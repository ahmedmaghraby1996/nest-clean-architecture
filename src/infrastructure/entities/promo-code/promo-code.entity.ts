import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Col } from 'sequelize/types/utils';
import { Reservation } from '../reservation/reservation.entity';

@Entity()
export class PromoCode extends AuditableEntity {
  @Column({ unique: true })
  code: string;

  @ManyToOne(() => User, (user) => user.promoCodes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => Reservation, (reservation) => reservation.promo_code)
  reservations: Reservation[];
  @Column()
  discount: number;
  @Column()
  expire_at: Date;
  @Column()
  number_of_uses: number;
  @Column({ nullable: true })
  user_id: string;

  constructor(data: Partial<PromoCode>) {
    super();
    Object.assign(this, data);
  }
}
