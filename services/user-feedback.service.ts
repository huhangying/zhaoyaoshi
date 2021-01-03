import { UserFeedback } from '../models/io/user-feedback.model';
import { getApi, postApi } from './core/api.service';
import { Notification } from '../models/io/notification.model';


// feedback
export function getByFeedbacksByUserIdDoctorId(did: string, uid: string, type: number) {
  return getApi<UserFeedback[]>(`feedbacks/user/${type}/${uid}/${did}`);
}

export function getFeedbacksByType(type: number, uid: string) {
  return getApi<UserFeedback[]>(`feedbacks/user/${type}/${uid}`);
}

export function sendFeedback(feedback: UserFeedback) {
  return postApi<UserFeedback>('feedback', feedback);
}

// unread list
export function getFeedbackUnreadListByDocter(doctorId: string) {
  return getApi<UserFeedback[]>(`feedbacks/unread/doctor/${doctorId}`);
}

export function setReadByDocterPatientAndType(doctorId: string, patientId: string, type: number) {
  return getApi(`feedbacks/read/doctor/${type}/${doctorId}/${patientId}`);
}

//---------------------------------------------------
// Notifications
//---------------------------------------------------

// after app started
export function convertFeedbackNotificationList(feedbacks: UserFeedback[]): Notification[] {
  if (!feedbacks?.length) return [];
  const keys: string[] = [];
  const feedbackNotifications = feedbacks.reduce((notis: Notification[], feedback) => {
    const key = feedback.user + feedback.type;
    if (keys.indexOf(key) === -1) {
      keys.push(key);
      notis.push({
        patientId: feedback.user,
        type: feedback.type,
        name: feedback.senderName || '', // to remove
        count: 1,
        keyId: feedback._id,
        created: feedback.createdAt
      });
      return notis;
    }
    notis = notis.map(_ => {
      if (_.patientId === feedback.user && _.type === feedback.type) {
        _.count = (_.count || 0) + 1;
      }
      return _;
    });
    return notis;
  }, []);

  return feedbackNotifications;
}
