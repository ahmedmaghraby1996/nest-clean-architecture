import { Entity, OneToMany } from "typeorm";
import { PhOrder } from "./ph-order.entity";
import { AuditableEntity } from "src/infrastructure/base/auditable.entity";

@Entity()
export class PhReply extends AuditableEntity {
    
    @OneToMany(()=>PhOrder,order=>order.ph_replies)
    orders:PhOrder
}