import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Notification, NotificationType } from '../models/io/notification.model';
import { convertChatNotificationList, getChatUnreadListByDocter } from './chat.service';
import { convertConsultNotificationList, getPendingConsultsByDoctorId } from './consult.service';
import { AppStoreService } from './core/app-store.service';
import { convertFeedbackNotificationList, getFeedbackUnreadListByDocter } from './user-feedback.service';


//---------------------------------------------------
// Notifications
//---------------------------------------------------

export function getUnreadCount(notifications: Notification[] = []) {
  if (!notifications?.length) return undefined;
  return notifications.reduce((total, noti) => {
    total += (noti.count || 0);
    return total;
  }, 0);
}

// no use!
export function addNotification(noti: Notification, appStore: AppStoreService) {
  let notifications = [];
  // save to store
  switch (noti.type) {
    case NotificationType.chat:
      notifications = addNotiToExisted(appStore.state.chatNotifications, noti);
      return appStore.updateChatNotifications(notifications);

    case NotificationType.adverseReaction:
    case NotificationType.doseCombination:
      notifications = addNotiToExisted(appStore.state.feedbackNotifications, noti);
      return appStore.updateFeedbackNotifications(notifications);

    case NotificationType.consultChat:
    case NotificationType.consultPhone:
      notifications = addNotiToExisted(appStore.state.consultNotifications, noti);
      return appStore.updateConsultNotifications(notifications);
  }
}

export function addNotiToExisted(storeNotifications: any[] = [], noti: Notification) {
  let notifications: Notification[] = [];
  if (!storeNotifications?.length) {
    notifications = [noti];
  } else {
    notifications = [...storeNotifications];
    if (notifications.findIndex(_ => _.created === noti.created && _.patientId === noti.patientId && _.type === noti.type) > -1) {
      // skip duplicated
      return notifications;
    }
    const index = notifications.findIndex(_ => _.patientId === noti.patientId && _.type === noti.type);
    // if new
    if (index === -1) {
      notifications.push(noti);
    } else { // if existed
      notifications[index].count = (notifications[index].count || 0) + 1;
      notifications[index].created = noti.created;
    }
  }
  return notifications;
}

export function getUnreadList(doctorId: string) {
  return forkJoin({
    chats: getChatUnreadListByDocter(doctorId),
    feedbacks: getFeedbackUnreadListByDocter(doctorId),
    consults: getPendingConsultsByDoctorId(doctorId)
  }).pipe(
    map(({ chats, feedbacks, consults }) => {
      return {
        chatNotifications: convertChatNotificationList(chats, NotificationType.chat),
        feedbackNotifications: convertFeedbackNotificationList(feedbacks),
        consultNotifications: convertConsultNotificationList(consults),
      };
    })
  );
}

export const getNotificationNameByType = (type: NotificationType) => {
  switch (type) {
    case NotificationType.chat:
      return '咨询消息';
    case NotificationType.adverseReaction:
      return '不良反应反馈消息';
    case NotificationType.doseCombination:
      return '联合用药反馈消息';
    case NotificationType.consultChat:
      return '付费图文咨询消息';
    case NotificationType.consultPhone:
      return '付费电话咨询消息';
    default:
      return '';
  }
}