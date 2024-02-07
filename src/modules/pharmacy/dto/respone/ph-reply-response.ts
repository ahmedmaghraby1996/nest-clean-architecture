import { Expose, Transform } from 'class-transformer';
import { toUrl } from 'src/core/helpers/file.helper';
import {
  PhOrderReplyType,
  PharmacyAttachmentType,
} from 'src/infrastructure/data/enums/pharmacy-attachment-typs';

export class PhReplyResponse {
  @Expose()
  id: string;

  @Expose()
  created_at: Date;

  @Expose()
  phone: string;
  @Expose()
  note: string;

  @Expose()
  price: string;

  @Expose()
  availability: PhOrderReplyType;
  @Expose()
  @Transform((value) => {
    return {
      id: value.obj.pharmacy.id,
      name:
        value.obj.pharmacy.user.first_name + ' ' + value.obj.pharmacy.last_name,
      logo: value.obj.pharmacy.attachments.filter(
        (attachment) => attachment.type === PharmacyAttachmentType.LOGO,
      ).map((attachment) => toUrl(attachment.file)),
    };
  })
  pharmacy: any;
}
