import { BaseEntity } from "src/infrastructure/base/base.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class WeekDays extends BaseEntity {
@Column()
name_ar:string
name_en:string
    
}