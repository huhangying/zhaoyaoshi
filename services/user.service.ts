import { User } from "../models/crm/user.model";
import { getApi, patchApi } from "./core/api.service";

export function getUserCountByDoctorId(doctorId: string) {
  return getApi<{total: number}>(`relationships/count/doctor/${doctorId}`);
}

// 审核用户
export function updateRoleById(id: string, role: number) {
  return patchApi<User>('user/' + id, { _id: id, role: role });
}
