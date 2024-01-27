import { BaseEntity } from "src/infrastructure/base/base.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { DrugCategory } from "./drug-category.entity";

@Entity()

export class Drug extends BaseEntity {
  @Column()
  name_ar:string

  @Column()
  name_en:string

  @ManyToOne(()=>DrugCategory,(drugCategory)=>drugCategory.drugs)
  @JoinColumn({name:'category_id'})
  category:DrugCategory

  @Column()
 category_id:string

}