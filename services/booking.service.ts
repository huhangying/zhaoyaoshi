import { Booking } from "../models/reservation/booking.model";
import { Period } from "../models/reservation/schedule.model";
import { getApi } from "./core/api.service";
import moment from 'moment';

export function getBookingStatus(status: number) {
  return [
    '',
    '用户预约', // 1
    '用户取消', // 2
    '药师取消', // 3
    '药师前转中', // 4
    '门诊完成', // 5
    '标记完成', // 6
    '药师接手中' // 7
  ].find((v, index) => index === status) || '';
}

// Booking ()
export function  getAllBookingsByDoctorId(doctorId: string) {
  const from = moment().add(-60, 'd').toISOString();
  return getApi<Booking[]>(`bookings/doctor/${doctorId}/${from}`);
}
// Period
export function getPeriods() {
  return getApi<Period[]>('periods');
}