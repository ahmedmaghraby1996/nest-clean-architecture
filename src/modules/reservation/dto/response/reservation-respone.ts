import { Expose, plainToInstance } from 'class-transformer';
import { toUrl } from 'src/core/helpers/file.helper';
import { ReservationStatus } from 'src/infrastructure/data/enums/reservation-status.eum';
import { ReservationType } from 'src/infrastructure/data/enums/reservation-type';
import { Doctor } from 'src/infrastructure/entities/doctor/doctor.entity';
import { Specialization } from 'src/infrastructure/entities/doctor/specialization.entity';
import { ReservationAttachments } from 'src/infrastructure/entities/reservation/reservation-attachments.entity';
import { Reservation } from 'src/infrastructure/entities/reservation/reservation.entity';

export class ReservationResponse {
  @Expose()
  id: string;
  @Expose()
  reservationType: ReservationType;
  @Expose()
  specialization: any;

  @Expose()
  phone: string;
  @Expose()
  status: ReservationStatus;
  @Expose()
  note: string;

  @Expose()
  attachments: any;

  @Expose()
  doctor: any;

  @Expose()
  agora_token: string;
  @Expose()
  end_date: Date;

  @Expose()
  latitude: number;
  @Expose()
  longitude: number;

  @Expose()
  family_member: any;

  @Expose()
  client_info: any;

  constructor(data: Partial<ReservationResponse>) {
    this.end_date = data.end_date;
    this.id = data.id;
    this.note = data.note;
    this.phone = data.phone;
    this.latitude = data.latitude;
    this.longitude = data.longitude;
    this.agora_token = data.agora_token ? data.agora_token : null;
    this.status = data.status;
    this.reservationType = data.reservationType;
    this.specialization = {
      id: data.specialization.id,
      name: data.specialization.name,
    };
    this.attachments = data.attachments
      ? data.attachments.map((e) => {
          e.file = toUrl(e.file);
          return{file: e.file,provider:e.type};
        })
      : null;

    this.doctor = data.doctor
      ? {
          id: data.doctor.id,
          name: data.doctor.user.first_name + ' ' + data.doctor.user.last_name,
        }
      : null;

    this.family_member = data.family_member
      ? {
          id: data.family_member.id,
          name: data.family_member.first_name,
          height: data.family_member.height,
          weight: data.family_member.weight,
          kinship: data.family_member.kinship,

          allergic_reactions: data.family_member.allergic_reactions,

          notes: data.family_member.notes,
        }
      : null;

    this.client_info = data['user'].client_info
      ? {
          height: data['user'].client_info.height,
          weight: data['user'].client_info.weight,

          allergic_reactions: data['user'].client_info.allergic_reactions,

          notes: data['user'].client_info.notes,
        }
      : null;
  }
}