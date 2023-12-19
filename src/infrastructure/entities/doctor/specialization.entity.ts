import { BaseEntity } from "src/infrastructure/base/base.entity";
import { Column, Entity, ManyToMany, OneToMany } from "typeorm";
import { Reservation } from "../reservation/reservation.entity";
import { Doctor } from "./doctor.entity";

@Entity()
export class Specialization extends BaseEntity{

@Column()
name_ar: string;

@Column()
name_en:string

@OneToMany(()=>Reservation,reservation=>reservation.specialization)
reservations:Reservation[]


@OneToMany(()=>Doctor,doctor=>doctor.specialization)
doctors:Doctor[]


constructor(data:Partial<Specialization>){
    super()
    Object.assign(this,data)
}
}