import { Otp } from "../entities/auth/otp.entity";
import { User } from "../entities/user/user.entity";
import { Address } from "../entities/user/address.entity";
import { Doctor } from "../entities/doctor/doctor.entity";
import { DoctorLicense } from "../entities/doctor/doctor-license.entity";
import { Specialization } from "../entities/doctor/specialization.entity";
import { Reservation } from "../entities/reservation/reservation.entity";
import { ReservationAttachments } from "../entities/reservation/reservation-attachments.entity";
import { FamilyMember } from "../entities/client/family-member.entity";
import { Client } from "../entities/client/client.entity";
import { Offer } from "../entities/reservation/offers.entity";
import { DoctorAvaliablity } from "../entities/doctor/doctor-avaliablity.entity";
import { WeekDays } from "../entities/week-days/week-days.entity";
import { Clinc } from "../entities/doctor/clinc.entity";

export const DB_ENTITIES = [
  User,
  Address,
  Offer,
  Otp,
  Doctor,
  DoctorLicense,
  Specialization,
  Reservation,
  ReservationAttachments,
  FamilyMember,
  Client,
  DoctorAvaliablity,
  WeekDays,
  Clinc
  
];

export const DB_VIEWS = [];
