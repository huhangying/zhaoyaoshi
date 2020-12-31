import { Notification, NotificationType } from '../models/io/notification.model';


//---------------------------------------------------
// Notifications
//---------------------------------------------------

export function getUnreadCount(notifications: Notification[] = []) {
  if (!notifications?.length) return 0;
  return notifications.reduce((total, noti) => {
    total += (noti.count || 0);
    return total;
  }, 0);
}

// export function chatCount() { return getUnreadCount(this.chatNotifications); }
// export function feedbackCount() { return getUnreadCount(this.feedbackNotifications); }
// export function consultCount() { return getUnreadCount(this.consultNotifications); }
export const getNotificationNameByType = (type: NotificationType) => {
  switch(type) {
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