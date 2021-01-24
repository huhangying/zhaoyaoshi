import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { AppStateStatus, ColorSchemeName } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';

import { SocketioService } from '../services/core/socketio.service';
import { Notification, NotificationType } from '../models/io/notification.model';
import { take, tap } from 'rxjs/operators';
import { useDispatch, useSelector, useStore } from 'react-redux'
import {
  updateChatNotifications, updateConsultNotifications, updateFeedbackNotifications,
  UpdateIoService
} from '../services/core/app-store.actions';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { addNotiToExisted, getNotificationNameByType, getUnreadList } from '../services/notification.service';
import { getDateTimeFormat } from '../services/core/moment';
import { AppState as appState } from 'react-native';
import { AppState } from '../models/app-state.model';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Stack = createStackNavigator();
// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const store = useStore();
  const dispatch = useDispatch();
  const [inited, setInited] = useState(false)
  const initNavigation: any = null;
  const navigationRef = React.useRef(initNavigation);

  const [expoPushToken, setExpoPushToken] = useState('');
  const [currentState, setCurrentState] = useState(appState.currentState);

  const ioService = useSelector((state: AppState) => state.ioService)


  const pushLocalNotification = async (noti: Notification, path: string) => {
    if (store.getState().appSettings?.disableNoti) return; // if 关闭消息提醒
    if (!noti) return;
    const notiName = getNotificationNameByType(noti.type || 0);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${noti.count} 个${notiName}`,
        body: `${noti.name} 发送于${getDateTimeFormat(noti.created)}`,
        data: {
          // url: `zhaoyaoshi://chat?pid=${noti.patientId}&title=${noti.name} ${notiName}&type=${noti.type}`
          url: Linking.makeUrl(path, { pid: noti.patientId, title: noti.name + ' ' + notiName, type: '' + noti.type })
        },
      },
      trigger: { seconds: 2 },
    });
  }

  const getLatestNotis = useCallback((doctorid: string) => {
    // 更新消息
    getUnreadList(doctorid).pipe(
      take(1),
      tap(({ chatNotifications, feedbackNotifications, consultNotifications }) => {
        dispatch(updateChatNotifications(chatNotifications));
        dispatch(updateFeedbackNotifications(feedbackNotifications));
        dispatch(updateConsultNotifications(consultNotifications));
      })
    ).subscribe();
  }, [dispatch]);

  const attachNotificationListeners = useCallback((socketio: SocketioService) => {
    socketio?.onNotification(async (noti: Notification) => {
      const state = store.getState();
      const notiPage = state?.notiPage;
      // if (state.doctor?._id === noti.doctorId) return; // skip self-send noti (在不同手机上打开两个相同的app)
      // add the following line if 已经在chat/feedback 页面同病患交互不算新消息。
      // if (noti.patientId === this.pid && noti.type === +this.notiType) return; // skip
      let notifications = [];

      switch (noti.type) {
        case NotificationType.chat:
          notifications = addNotiToExisted(state.chatNotifications, noti);
          dispatch(updateChatNotifications(notifications));
          if (!notiPage?.patientId || (notiPage.patientId === noti.patientId && notiPage.type !== noti.type)) {
            pushLocalNotification(noti, 'consult/chat');
          }
          break;

        case NotificationType.adverseReaction:
        case NotificationType.doseCombination:
          notifications = addNotiToExisted(state.feedbackNotifications, noti);
          dispatch(updateFeedbackNotifications(notifications));
          if (!notiPage?.patientId || (notiPage.patientId === noti.patientId && notiPage.type !== noti.type)) {
            pushLocalNotification(noti, 'feedback/feedback-chat');
          }
          break;

        case NotificationType.consultChat:
          notifications = addNotiToExisted(state.consultNotifications, noti);
          dispatch(updateConsultNotifications(notifications));
          if (!notiPage?.patientId || (notiPage.patientId === noti.patientId && notiPage.type !== noti.type)) {
            pushLocalNotification(noti, 'consult/consult-chat');
          }
          break;
        case NotificationType.consultPhone:
          notifications = addNotiToExisted(state.consultNotifications, noti);
          dispatch(updateConsultNotifications(notifications));
          if (!notiPage?.patientId || (notiPage.patientId === noti.patientId && notiPage.type !== noti.type)) {
            pushLocalNotification(noti, 'consult/consult-phone');
          }
          break;
      }
    });

  }, [dispatch, store]);

  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    if (currentState !== nextAppState) {
      // console.log('App State: ' + currentState + ' -> ' + nextAppState);
      const doctorid = store.getState()?.doctor?._id
      if (nextAppState === 'active' && doctorid) {
        const doctorId = store.getState()?.doctor?._id;

        const socketio = new SocketioService(doctorId);
        setTimeout(() => {
          getLatestNotis(doctorid); // 更新消息
          attachNotificationListeners(socketio);
          dispatch(UpdateIoService(socketio));
        })
      } else if (nextAppState === 'background'){ // background or inactive
        ioService?.disconnect();
        dispatch(UpdateIoService());
      }
      setCurrentState(nextAppState);
    }
  }, [currentState, store, getLatestNotis, attachNotificationListeners, dispatch, ioService]);

  useEffect(() => {
    if (!inited) {
      const doctorId = store.getState()?.doctor?._id;
      if (doctorId) {
        // console.log('..');
        const socketio = new SocketioService(doctorId);
        setTimeout(() => {
          getLatestNotis(doctorId); // 更新消息
          attachNotificationListeners(socketio);
          dispatch(UpdateIoService(socketio));
        });
      }

      // push notification
      registerForPushNotificationsAsync().then(token => setExpoPushToken(token || ''));
      setInited(true);
    }

    appState?.addEventListener('change', handleAppStateChange);

    return () => {
      appState?.removeEventListener('change', handleAppStateChange);
    }
  }, [store, dispatch, handleAppStateChange, attachNotificationListeners, getLatestNotis, ioService, inited]);


  return (
    <NavigationContainer
      ref={navigationRef}
      linking={{
        ...LinkingConfiguration,
        subscribe(listener) {
          const onReceiveURL = ({ url }: { url: string }) => listener(url);

          // Listen to incoming links from deep linking
          Linking.addEventListener('url', onReceiveURL);

          // Listen to expo push notifications
          const subscription = Notifications.addNotificationResponseReceivedListener(response => {
            const url = response.notification.request.content.data.url as string;

            // Let React Navigation handle the URL
            const { path, queryParams } = Linking.parse(url);
            if (navigationRef?.current?.navigate) {
              switch (path) {
                case 'consult/chat':
                  navigationRef.current.navigate('ChatScreen', queryParams || {})
                  break;
                case 'feedback/feedback-chat':
                  navigationRef.current.navigate('FeedbackChatScreen', queryParams || {})
                  break;
                case 'consult/consult-chat':
                  navigationRef.current.navigate('ConsultScreen', queryParams || {})
                  break;
                case 'consult/consult-phone':
                  navigationRef.current.navigate('ConsultPhoneScreen', queryParams || {})
                  break;
                default:
                  break;
              }
            }

            listener(url);
          });

          return () => {
            // Clean up the event listeners
            Linking.removeEventListener && Linking.removeEventListener('url', onReceiveURL);
            subscription.remove();
          };
        },
      }}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Root" component={BottomTabNavigator} />
        <Stack.Screen name="NotFound" component={NotFoundScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('获取消息提醒权限失败!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      // enableVibrate: false,
    });
  }

  return token;
}
