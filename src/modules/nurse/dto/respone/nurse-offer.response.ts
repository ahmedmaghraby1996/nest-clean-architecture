import { Expose, Transform } from 'class-transformer';
import { toUrl } from 'src/core/helpers/file.helper';

export class NurseOfferResponse {
  @Expose()
  id: string;
  @Expose()
  value: number;
  @Expose()
  @Transform((value) => {
    return {
      name:
        value.obj.nurse.user.first_name + ' ' + value.obj.nurse.user.last_name,
      avatar: toUrl(value.obj.nurse.user.avatar),
      phone: value.obj.nurse.user.phone,
    };
  })
  nurse: any;
  @Expose()
  created_at: Date;
}
