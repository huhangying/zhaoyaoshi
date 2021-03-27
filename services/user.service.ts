import { User } from "../models/crm/user.model";
import { getApi, patchApi } from "./core/api.service";

export function getUserDetailsById(id: string) {
  return getApi<User>(`user/${id}`);

}

export function getUserCountByDoctorId(doctorId: string) {
  return getApi<{ total: number }>(`relationships/count/doctor/${doctorId}`);
}

// 审核用户
export function updateRoleById(id: string, role: number) {
  return patchApi<User>('user/' + id, { _id: id, role: role });
}

// Patient search
export function searchByCriteria(searchType: string, searchQuery: string) {
  let search;
  switch (searchType) {
    case 'name':
      search = { name: searchQuery };
      break;
    case 'cell':
      search = { cell: searchQuery };
      break;
    case 'notes':
      search = { notes: searchQuery };
      break;
  }
  return patchApi<User[]>('users/search', search);
}

