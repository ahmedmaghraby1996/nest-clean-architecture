import { Expose, Transform, plainToInstance } from 'class-transformer';
import { toUrl } from 'src/core/helpers/file.helper';
import {
  PhOrderAttachmentType,
  PharmacyAttachmentType,
} from 'src/infrastructure/data/enums/pharmacy-attachment-typs';
import { Drug } from 'src/infrastructure/entities/pharmacy/drug.entity';
import { PhOrderAttachments } from 'src/infrastructure/entities/pharmacy/ph-order-attachments.entity';
import { PhReply } from 'src/infrastructure/entities/pharmacy/ph-reply.entity';
import { Address } from 'src/infrastructure/entities/user/address.entity';
import { User } from 'src/infrastructure/entities/user/user.entity';

export class PhOrderResponse {
  @Expose()
  id: string;
  @Expose()
  status: string;
  @Expose()
  created_at: string;
  @Expose()
  number: string;
  @Expose()
  user_id: string;
  @Expose()
  @Transform((value) => {
    return {
      name: value.obj.user.first_name + value.obj.user.last_name,
      avatar: toUrl(value.obj.user.avatar),
    };
  })
  user: any;
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

  @Expose()
  @Transform((value) =>
    plainToInstance(
      PhReply,
      value.obj.ph_replies.map((reply) => {
        reply.pharmacy.attachments = reply.pharmacy.attachments.filter(
          (attachment) => {
            if (attachment.type === PharmacyAttachmentType.LOGO) {
              attachment.file = toUrl(attachment.file);

              return attachment;
            }
          },
        );
        return reply;
      }),
    ),
  )
  replies: any[];
}
