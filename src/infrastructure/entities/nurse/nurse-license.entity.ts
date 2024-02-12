import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Nurse } from './nurse.entity';
import { AuditableEntity } from 'src/infrastructure/base/auditable.entity';
@Entity()
export class NurseLicense extends AuditableEntity {
  @Column()
  image: string;

  @ManyToOne(() => Nurse, (nurse) => nurse.license_images)
  @JoinColumn({ name: 'nurse_id' })
  nurse: Nurse;
  @Column()
  nurse_id: string;
}
