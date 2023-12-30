import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Doctor } from "./doctor.entity";
import { WeekDays } from "../week-days/week-days.entity";
import { BaseEntity } from "src/infrastructure/base/base.entity";

@Entity()
export class DoctorAvaliablity extends BaseEntity{

@ManyToOne(() => Doctor,doctor=>doctor.avaliablity,{nullable:true})
@JoinColumn()
doctor:Doctor


@Column()
day_id:string

@Column({ type: 'decimal', precision: 10, scale: 2 })
from:number

@Column({ type: 'decimal', precision: 10, scale: 2 })
to:number


}