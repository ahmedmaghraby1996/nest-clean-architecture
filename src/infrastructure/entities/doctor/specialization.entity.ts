import { BaseEntity } from "src/infrastructure/base/base.entity";
import { Column, Entity, ManyToMany, OneToMany } from "typeorm";

import { Doctor } from "./doctor.entity";

@Entity()
export class Specialization extends BaseEntity{

@Column()
name_ar: string;

@Column()
name_en:string




@OneToMany(()=>Doctor,doctor=>doctor.specialization)
doctors:Doctor[]


constructor(data:Partial<Specialization>){
    super()
    Object.assign(this,data)
}
}