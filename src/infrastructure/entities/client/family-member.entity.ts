import { Factory } from 'nestjs-seeder';
import { Gender } from 'src/infrastructure/data/enums/gender.enum';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Client } from './client.entity';
import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
import { Reservation } from '../reservation/reservation.entity';

@Entity()
export class FamilyMember extends AuditableEntity {
  @ManyToOne(() => Client, (client) => client.familyMembers)
  @JoinColumn()
  client: Client;

  @Column()
  client_id: string;

  @Column({ length: 100 })
  first_name: string;

  @Column({ length: 100 })
  last_name: string;

  @Factory((faker) => faker.internet.avatar())
  @Column({ nullable: true, length: 500 })
  avatar: string;

  @Column()
  kinship: string;

  @Column()
  birth_date: string;

  @Factory((faker) => faker.helpers.arrayElement(Object.values(Gender)))
  @Column({ nullable: true, type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ nullable: true })
  height: number;

  @Column({ nullable: true })
  weight: number;

  @Column({ nullable: true, type: 'text' })
  allergic_reactions: string;

  @OneToMany(() => Reservation, (reservation) => reservation.family_member)
  reservations: Reservation[];

  @Column({ nullable: true, type: 'text' })
  notes: string;

  constructor(partial: Partial<FamilyMember>) {
    super();
    Object.assign(this, partial);
  }
}
