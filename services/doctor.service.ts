
import { DoctorGroup } from '../models/crm/doctor-group.model';
import { Doctor } from '../models/crm/doctor.model';
import { Relationship } from '../models/crm/relationship.model';
import { getApi, patchApi } from './core/api.service';
// getDoctorsByDepartment(departmentId: string) {
//   return this.api.get<Doctor[]>('doctors/department/' + departmentId);
// }

export function getDoctorDetailsById(id: string) {
  return getApi<Doctor>('doctor/brief/' + id);
}

// did is doctor user id
export function updateDoctorShortcuts(did: string, shortcuts: string) {
  return patchApi<Doctor>('doctor/shortcuts/' + did, { shortcuts });
}


export function doctorLogin(user_id: string, password: string) {
  return patchApi<Doctor>('app-login/doctor', { user_id, password, hid: 2 });
}

// use for populating groups in relationships
export function getDoctorGroupsByDoctorId(doctorId: string) {
  return getApi<DoctorGroup[]>('groups/doctor/' + doctorId);
}

// 医患关系
// patient populated (name, gender, cell)
export function getRelationshipsByDoctorId(doctorId: string) {
  return getApi<Relationship[]>('relationships/doctor/' + doctorId);
}


