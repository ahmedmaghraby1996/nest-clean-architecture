import { BaseEntity } from 'src/infrastructure/base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { DrugCategory } from './drug-category.entity';

@Entity()
export class Drug extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => DrugCategory, (drugCategory) => drugCategory.drugs)
  @JoinColumn({ name: 'category_id' })
  category: DrugCategory;

  @Column()
  category_id: string;

  constructor(data: Partial<Drug>) {
    super();
    Object.assign(this, data);
  }
}
