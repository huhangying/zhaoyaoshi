import { DoctorConsult } from '../models/consult/doctor-consult.model';
import { map } from 'rxjs/operators';
import { Consult, ExistedConsult } from '../models/consult/consult.model';
import { Notification, NotificationType } from '../models/io/notification.model';
import { deleteApi, getApi, patchApi, postApi } from './core/api.service';
import { DoctorConsultComment } from '../models/consult/doctor-consult-comment.model';

export const presetComments = [
  { type: 1, label: '建议非常有用' },
  { type: 2, label: '普及相关知识' },
  { type: 3, label: '消除了疑惑' },
  { type: 4, label: '解答不厌其烦' },
];

// 付费咨询 consult
export function getPendingConsultByDoctorIdAndUserId(doctorId: string, userId: string) {
  return getApi<Consult>(`consult/get-pending/${doctorId}/${userId}`);
}

export function getPendingConsultsByDoctorId(doctorId: string) {
  return getApi<Consult[]>(`consults/get-pending/${doctorId}`);
}

export function getConsultById(id: string) {
  return getApi<Consult>('consult/' + id);
}

export function GetConsultsByDoctorIdUserIdAndType(doctorId: string, userId: string, type: number) {
  return getApi<Consult[]>(`consults/get-history/${doctorId}/${userId}/${type}`);
}

export function GetConsultsByDoctorIdAndUserId(doctorId: string, userId: string) {
  return getApi<Consult[]>(`consults/get/${doctorId}/${userId}`);
}

export function updateConsultById(id: string, data: Consult) {
  return patchApi<Consult>('consult/' + id, data);
}

export function sendConsult(data: Consult) {
  return postApi<Consult>('consult', data);
}

export function setConsultDoneByDocterUserAndType(doctorId: string, userId: string, type: number) {
  return getApi(`consults/mark-done/${doctorId}/${userId}/${type}`);
}

export function checkConsultExistsByDoctorIdAndUserId(doctorId: string, userId: string) {
  return getApi<ExistedConsult>(`consults/check-exists/${doctorId}/${userId}`);
}


// after app started
export function convertConsultNotificationList(consults: Consult[]): Notification[] {
  if (!consults?.length) return [];
  const keys: string[] = [];
  const consultNotifications = consults.reduce((notis: Notification[], consult) => {
    const type = consult.type === 1 ? NotificationType.consultPhone : NotificationType.consultChat; // (0: 图文；1：电话) => notiType
    const key = consult.user + type;
    if (keys.indexOf(key) === -1) {
      keys.push(key);
      notis.push({
        patientId: consult.user,
        type: type,
        name: consult.userName || '',
        count: 1,
        keyId: consult._id,
        created: consult.createdAt
      });
      return notis;
    }
    notis = notis.map(_ => {
      if (_.patientId === consult.user && _.type === type) {
        _.count = (_.count || 0) + 1;
      }
      return _;
    });
    return notis;
  }, []);

  return consultNotifications;
}

// doctor consult

export function getDoctorConsultByDoctorId(doctorId: string) {
  return getApi<DoctorConsult>('doctor-consult/' + doctorId).pipe(
    map(dc => {
      if (!dc?.presetComments?.length) {
        return dc;
      }
      dc.presetComments = dc.presetComments.map(pc => {
        const found = presetComments.find(_ => _.type === pc.type);
        return found ? { ...pc, label: found.label } : pc;
      });
      return dc;
    })
  );
}

export function updateDoctorConsult(doctorId: string, data: DoctorConsult) {
  return postApi<DoctorConsult>('doctor-consult/' + doctorId, data);
}

// doctor consult comment

export function getAllDoctorConsultComments(doctorId: string) {
  return getApi<DoctorConsultComment[]>('doctor-consult-comment/' + doctorId);
}

export function getDoctorConsultCommentsBy(doctorId: string, from: number, size: number) {
  return getApi<DoctorConsultComment[]>(`doctor-consult-comment/${doctorId}/${from}/${size}`);
}

export function addDoctorConsultComment(dcc: DoctorConsultComment) {
  return postApi<DoctorConsultComment>('doctor-consult-comment', dcc);
}

export function deleteDoctorConsultCommentById(id: string) {
  return deleteApi('doctor-consult-comment/' + id);
}


