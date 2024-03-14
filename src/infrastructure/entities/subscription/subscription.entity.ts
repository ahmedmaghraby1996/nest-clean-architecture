import { AuditableEntity } from "src/infrastructure/base/auditable.entity";
import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Package } from "./package.entity";
import { User } from "../user/user.entity";

@Entity()
export class Subscription extends AuditableEntity {
    
    @ManyToOne(() => Package, (packageEntity) => packageEntity.subscriptions)
    package: Package
    @Column({default:0})
    number_of_used_orders: number

    @Column()
    expiration_date: Date
    @ManyToOne(()=>User,(user)=>user.subscriptions)
    @JoinColumn({name:'user_id'})
    user:User
    @Column()
    user_id:string

    constructor(data: Partial<Subscription>) {
        super();
        Object.assign(this, data);
    }

}