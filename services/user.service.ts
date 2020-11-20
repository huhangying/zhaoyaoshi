import { getApi } from "./core/api.service";

export function getUserCountByDoctorId(doctorId: string) {
  return getApi<{total: number}>(`relationships/count/doctor/${doctorId}`);
}
