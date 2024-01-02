import { BaseEntity } from 'src/infrastructure/base/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Doctor } from './doctor.entity';
@Entity()
export class Clinc extends BaseEntity {

@Column()
name:string

@Column()
address:string


@Column({ type: 'float', precision: 10, scale: 6 })
latitude: number;


@Column({ type: 'float', precision: 11, scale: 6 })
longitude: number;

@Column({default:true})
is_active:boolean

@OneToMany(()=>Doctor,(doctor)=>doctor.clinc)
doctors:Doctor[]

}
