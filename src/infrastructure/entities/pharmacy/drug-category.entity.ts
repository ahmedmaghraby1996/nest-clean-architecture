import { BaseEntity } from 'src/infrastructure/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Drug } from './drug.entity';

@Entity()
export class DrugCategory extends BaseEntity {
  @Column()
  name_ar: string;

  @Column()
  name_en: string;
  @OneToMany(() => Drug, (drug) => drug.category)
  drugs: Drug[];
  constructor(data: Partial<DrugCategory>) {
    super();
    Object.assign(this, data);
  }
}
