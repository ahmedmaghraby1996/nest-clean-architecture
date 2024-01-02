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
doctor_id:string

@Column()
day:number

@Column({ type: 'decimal', precision: 10, scale: 2 })
start_at:number

@Column({ type: 'decimal', precision: 10, scale: 2 })
end_at:number

@Column({default:false})
is_active:boolean

constructor(data: Partial<DoctorAvaliablity>) {
    super();
    Object.assign(this,data);
}

}