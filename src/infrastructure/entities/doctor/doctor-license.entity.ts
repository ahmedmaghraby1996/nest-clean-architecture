import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Doctor } from "./doctor.entity";
import { BaseEntity } from "src/infrastructure/base/base.entity";
import { AuditableEntity } from "src/infrastructure/base/auditable.entity";

@Entity()

export class DoctorLicense extends AuditableEntity {

 @Column()
 image:string
 
 @ManyToOne(()=>Doctor,doctor=>doctor.licenses,{cascade:true,onDelete:'CASCADE',onUpdate:'CASCADE'})
 @JoinColumn({name:'doctor_id'})
 doctor:Doctor



 @Column()
 doctor_id:string



 constructor(data:Partial<DoctorLicense>){
    super() 
    Object.assign(this,data);
  
 }
}