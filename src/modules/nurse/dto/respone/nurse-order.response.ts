import { Expose, Transform, plainToInstance } from 'class-transformer';
import { toUrl } from 'src/core/helpers/file.helper';
import { Address } from 'src/infrastructure/entities/user/address.entity';
import { User } from 'src/infrastructure/entities/user/user.entity';

export class NurseOrderResponse {
  @Expose()
  id: string;

  @Expose()
  @Transform((user) => {
    return {
      name: user.value.first_name + ' ' + user.value.last_name,
      id: user.value.id,
      avatar: toUrl(user.value.avatar),
    };
  })
  user: User;

  @Expose()
  @Transform((value) => {
    return {
      name:
        value.obj.nurse.user.first_name + ' ' + value.obj.nurse.user.last_name,
      avatar: toUrl(value.obj.nurse.user.avatar),
      phone: value.obj.nurse.user.phone,
      rating: value.obj.nurse.number_of_reviews==0?0: value.obj.nurse.rating/value.obj.nurse.number_of_reviews,
    };
  })
  nurse: any;

  @Expose()
  @Transform((address) => {
    return {
      id: address.value.id,
      address: address.value.address,
      latitude: address.value.latitude,
      longitude: address.value.longitude,
    };
  })
  address: Address;

  @Expose()
  notes: string;
  @Expose()
  date_from: Date;
  @Expose()
  date_to: Date;
}
