
import { map } from 'rxjs/operators';
import { DoctorGroup } from '../models/crm/doctor-group.model';
import { Doctor } from '../models/crm/doctor.model';
import { GroupedRelationship, Relationship } from '../models/crm/relationship.model';
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

export function getDoctorGroups(doctorId: string) {
  return getDoctorGroupsByDoctorId(doctorId).pipe(map(groups => ([
    { _id: '*', name: '全部群组' },
    { _id: '', name: '未分组' },
    ...groups
  ])));
}

export function getPatientGroupedRelationships(doctorId: string) {
  return getRelationshipsByDoctorId(doctorId).pipe(
    map(relationships => {
      const userIdList: string[] = [];
      const selectedGroupedRelationships = relationships.reduce((newGrouped: GroupedRelationship[], relationship: Relationship) => {
        const userId = relationship.user?._id || '';
        if (userId && userIdList.indexOf(userId) > -1) {
          // found, add into grouped
          return newGrouped.map(grouped => {
            if (grouped.user._id === userId) {
              grouped.relationships.push(relationship);
            }
            return grouped;
          });
        }
        userIdList.push(userId);
        if (relationship.user) {
          newGrouped.push({ user: relationship.user, relationships: [relationship] });
        }
        return newGrouped;
      }, []);
      return selectedGroupedRelationships;
    })
  );
}

// 其它功能
export function getRoleLabel(role = 0) {
  switch (role) {
    case 0:
      return '药师';
    case 1:
      return '科室管理员';
    case 2:
      return '医院管理员';
    case 3:
      return '系统管理员';
    default:
      return '';
  }
}
