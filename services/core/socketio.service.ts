import io from 'socket.io-client';
import { Chat } from '../../models/io/chat.model';
import { Notification, NotificationType } from '../../models/io/notification.model';
import Constants from 'expo-constants';
import { UserFeedback } from '../../models/io/user-feedback.model';
import { Consult } from '../../models/consult/consult.model';
import { AppStoreService } from './app-store.service';
import { convertChatNotificationList, getChatUnreadListByDocter } from '../chat.service';
import { map } from 'rxjs/operators';
import { convertFeedbackNotificationList, getFeedbackUnreadListByDocter } from '../user-feedback.service';
import { convertConsultNotificationList, getPendingConsultsByDoctorId } from '../consult.service';
import { forkJoin } from 'rxjs';

export class SocketioService {
  socket: any;

  constructor(room?: string) {
    if (room) {
      this.connect(room);
    }
  }

  connect(room: string) {
    if (!this.socket) {
      this.socket = io(Constants.manifest.extra.socketUrl, {});
      this.socket?.emit('joinRoom', room);
      return;
    }
    if (this.socket.disconnected) {
      this.socket.connect();
    }
  }

  disconnect() {
    this.socket?.emit('disconnect');
  }

  isConnected(): boolean {
    return this.socket.connected || false;
  }

  joinRoom(room: string) {
    this.socket?.emit('joinRoom', room);
  }

  leaveRoom(room: string) {
    this.socket?.emit('leaveRoom', room);
  }

  // Chat
  onChat(next: any) {
    this.socket.on('chat', next);
  }

  sendChat(room: string, chat: Chat) {
    this.socket.emit('chat', room, {
      ...chat,
      created: new Date()
    });
  }

  // Feedback
  onFeedback(next: any) {
    this.socket.on('feedback', next);
  }

  sendFeedback(room: string, feedback: UserFeedback) {
    this.socket.emit('feedback', room, feedback);
  }

  // Consult Chat
  onConsult(next: any) {
    this.socket.on('consult', next);
  }

  sendConsult(room: string, consult: Consult) {
    this.socket.emit('consult', room, consult);
  }

  // Notifications
  onNotification(next: any) {
    this.socket.on('notification', next);
  }

  // no use!
  addNotification(noti: Notification, appStore: AppStoreService) {
    let notifications = [];
    // save to store
    switch (noti.type) {
      case NotificationType.chat:
        notifications = this.addNotiToExisted(appStore.state.chatNotifications, noti);
        return appStore.updateChatNotifications(notifications);

      case NotificationType.adverseReaction:
      case NotificationType.doseCombination:
        notifications = this.addNotiToExisted(appStore.state.feedbackNotifications, noti);
        return appStore.updateFeedbackNotifications(notifications);

      case NotificationType.consultChat:
      case NotificationType.consultPhone:
        notifications = this.addNotiToExisted(appStore.state.consultNotifications, noti);
        return appStore.updateConsultNotifications(notifications);
    }
  }

  addNotiToExisted(storeNotifications: any[] = [], noti: Notification) {
    let notifications: Notification[] = [];
    if (!storeNotifications?.length) {
      notifications = [noti];
    } else {
      notifications = [...storeNotifications];
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

  getUnreadCount(notifications: Notification[]) {
    if (!notifications?.length) return 0;
    return notifications.reduce((total, noti) => {
      total += (noti.count || 0);
      return total;
    }, 0);
  }

  getUnreadList(doctorId: string) {
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

}
