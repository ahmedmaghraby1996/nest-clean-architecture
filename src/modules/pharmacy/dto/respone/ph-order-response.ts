import { Expose, Transform, plainToInstance } from 'class-transformer';
import { PhOrderAttachmentType } from 'src/infrastructure/data/enums/pharmacy-attachment-typs';
import { Drug } from 'src/infrastructure/entities/pharmacy/drug.entity';
import { PhOrderAttachments } from 'src/infrastructure/entities/pharmacy/ph-order-attachments.entity';
import { Address } from 'src/infrastructure/entities/user/address.entity';

export class PhOrderResponse {
  @Expose()
  id: string;
  @Expose()
  status: string;
  @Expose()
  created_at: string;
  @Expose()
  user_id: string;
  @Expose()
  address: Address;
  @Expose()
  @Transform((value) => plainToInstance(Drug, value.obj.drugs))
  drugs: Drug[];
  @Expose()
  notes: string;
  @Expose()
  @Transform((value) =>
    plainToInstance(
      PhOrderAttachments,
      value.obj.ph_order_attachments.filter(
        (attachment) => attachment.type === PhOrderAttachmentType.FILE,
      ),
    ),
  )
  attachments: PhOrderAttachments[];
  @Expose()
  @Transform((value) =>
  plainToInstance(
    PhOrderAttachments,
    value.obj.ph_order_attachments.filter(
      (attachment) => attachment.type === PhOrderAttachmentType.VOICE,
    ),
  ),
)
  voice_recording: PhOrderAttachments[];
}
