import { UserFeedback } from '../models/io/user-feedback.model';
import { getApi, postApi } from './core/api.service';
import { Notification, NotificationType } from '../models/io/notification.model';
import { AppStoreService } from './core/app-store.service';


// feedback
export function getByUserIdDoctorId(did: string, uid: string, type: number) {
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
        _.count = _.count + 1;
      }
      return _;
    });
    return notis;
  }, []);

  return feedbackNotifications;
}

// after chatroom loaded (once a time)
export function removeFeedbacksFromNotificationList(doctorId: string, patientId: string, type: number, appStore: AppStoreService) {
  // get from store
  let notifications = appStore.state.feedbackNotifications;
  if (!notifications?.length) return;
  const notiType = type;
  notifications = notifications.filter(_ => _.patientId !== patientId || _.type !== notiType);

  // save back
  appStore.updateFeedbackNotifications(notifications);

  // mark read in db
  setReadByDocterPatientAndType(doctorId, patientId, type).subscribe();
}
