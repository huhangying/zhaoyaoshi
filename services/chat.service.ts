import { Chat } from '../models/io/chat.model';
import { Notification, NotificationType } from '../models/io/notification.model';
import { getApi, postApi } from './core/api.service';
import { AppStoreService } from './core/app-store.service';


export function getChatHistory(sender: string, to: string) {
  return getApi<Chat[]>(`chats/history/${sender}/${to}`);
}

export function sendChat(data: Chat) {
  return postApi<Chat>('chat/send', data);
}

// chat unread list
export function getChatUnreadListByDocter(doctorId: string) {
  return getApi<Chat[]>(`chats/unread/doctor/${doctorId}`);
}

export function setReadByDocterAndPatient(doctorId: string, patientId: string) {
  return getApi(`chats/read/doctor/${doctorId}/${patientId}`);
}

//---------------------------------------------------
// Notifications
//---------------------------------------------------

// after app started
export function convertChatNotificationList(chats: Chat[], notiType: NotificationType): Notification[] {
  if (!chats?.length) return [];
  const keys: string[] = [];
  const chatNotifications = chats.reduce((notis: Notification[], chat) => {
    const key = chat.sender + notiType;
    if (keys.indexOf(key) === -1) {
      keys.push(key);
      notis.push({
        patientId: chat.sender,
        type: notiType,
        name: chat.senderName || '', // to remove
        count: 1,
        keyId: chat._id,
        created: chat.created
      });
      return notis;
    }
    notis = notis.map(_ => {
      if (_.patientId === chat.sender) {
        // 如果重复计数的bug还是发生的话，在这里增加 通过验证时间戳（created）来确保不重复加
        _.count = _.count + 1;
      }
      return _;
    });
    return notis;
  }, []);

  return chatNotifications;
}

// after chatroom loaded (once a time), after doctor mark it read
export function removeChatsFromNotificationList(doctorId: string, patientId: string, appStore: AppStoreService) {
  // get from store
  let notifications = appStore.state.chatNotifications;
  if (!notifications?.length) return;
  notifications = notifications.filter(_ => _.patientId !== patientId);

  // save back
  appStore.updateChatNotifications(notifications);

  // mark read in db
  setReadByDocterAndPatient(doctorId, patientId).subscribe();
}
