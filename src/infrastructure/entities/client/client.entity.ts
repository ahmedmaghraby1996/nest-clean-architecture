import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { User } from "../user/user.entity";
import { OwnedEntity } from "src/infrastructure/base/owned.entity";
import { FamilyMember } from "./family-member.entity";
import { Reservation } from "../reservation/reservation.entity";
@Entity()
export class  Client extends OwnedEntity{

  @OneToMany(()=>Reservation,reservation=>reservation.client)
  reservations:Reservation[]
@Column({nullable:true})
height:number

@OneToMany(() => FamilyMember, (familyMember) => familyMember.client)
familyMembers: FamilyMember[]

@Column({nullable:true})

weight:number



@Column({nullable:true,type:"text"})
allergic_reactions:string



@Column({nullable:true,type:"text"})
notes:string

@OneToOne(()=>User,{onDelete:"CASCADE"})
  @JoinColumn({})
user:User


constructor(partial: Partial<Client>) {
    super();
    Object.assign(this, partial);
}


}