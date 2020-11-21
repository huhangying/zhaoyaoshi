import { Notification } from '../models/io/notification.model';


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