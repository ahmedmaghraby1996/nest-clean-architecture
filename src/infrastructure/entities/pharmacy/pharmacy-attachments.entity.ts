import { Column, Entity, ManyToOne } from 'typeorm';
import { Pharmacy } from './pharmacy.entity';
import { PharmacyAttachmentType } from 'src/infrastructure/data/enums/pharmacy-attachment-typs';
import { BaseEntity } from 'src/infrastructure/base/base.entity';

@Entity()
export class PharmacyAttachments extends BaseEntity {
  @Column()
  file: string;
  @Column()
  type: PharmacyAttachmentType;
  @ManyToOne(() => Pharmacy, (pharmacy) => pharmacy.attachments)
  pharmacy: Pharmacy;
  @Column()
  pharmacy_id: string;
}
