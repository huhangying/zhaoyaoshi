
import { Doctor } from '../models/crm/doctor.model';
import { getApi, patchApi } from './core/api.service';
// getDoctorsByDepartment(departmentId: string) {
//   return this.api.get<Doctor[]>('doctors/department/' + departmentId);
// }

export function getDoctorDetailsById(id: string) {
  return getApi<Doctor>('doctor/brief/' + id);
}


export function doctorLogin(user_id: string, password: string) {
  return patchApi<Doctor>('app-login/doctor', {user_id, password, hid: 2});
}



