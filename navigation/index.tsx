import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import SignInScreen from '../screens/SignInScreen';
import { getAuthState } from '../services/core/auth';
import { SocketioService } from '../services/core/socketio.service';
import { Notification, NotificationType } from '../models/io/notification.model';
import { tap } from 'rxjs/operators';
import { connect, useStore } from 'react-redux';
import { useDispatch } from 'react-redux'
import { updateChatNotifications, updateConsultNotifications, updateDoctor, updateFeedbackNotifications, UpdateIoService, updateIsLoggedIn, updateNotiPage, updateToken } from '../services/core/app-store.actions';
import { AppState } from "../models/app-state.model";
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { getNotificationNameByType } from '../services/notification.service';
import { getDateTimeFormat } from '../services/core/moment';
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
export function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const store = useStore();
  const dispatch = useDispatch();
  const initNavigation: any = null;
  const navigationRef = React.useRef(initNavigation);

  const [expoPushToken, setExpoPushToken] = useState('');

  const pushLocalNotification = async (noti: Notification, path: string) => {
    // if (noti.room === doctorId) {
    const notiName = getNotificationNameByType(noti.type || 0);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `${noti.count} 个${notiName}`,
        body: `${noti.name} 发送于${getDateTimeFormat(noti.created)}`,
        data: {
          // url: `exp://192.168.87.35:19006/consult/chat?pid=${noti.patientId}&title=${noti.name} ${notiName}&type=${noti.type}`
          url: Linking.makeUrl(path, { pid: noti.patientId, title: noti.name + ' ' + notiName, type: '' + noti.type })
          // url: `zhaoyaoshi://chat?pid=${noti.patientId}&title=${noti.name} ${notiName}&type=${noti.type}`
        },
      },
      trigger: { seconds: 2 },
    });
    // }
  }

  useEffect(() => {
    // const _auth = await getAuthState();
    getAuthState().then(_auth => {
      if (_auth?.doctor?._id) {
        dispatch(updateDoctor(_auth.doctor));
        dispatch(updateToken(_auth.token));
        // dispatch(updateIsLoggedIn(true));

        // inital store data, only once
        const socketio = new SocketioService(_auth.doctor._id);
        dispatch(UpdateIoService(socketio));

        socketio.getUnreadList(_auth.doctor._id).pipe(
          tap(({ chatNotifications, feedbackNotifications, consultNotifications }) => {
            dispatch(updateChatNotifications(chatNotifications));
            dispatch(updateFeedbackNotifications(feedbackNotifications));
            dispatch(updateConsultNotifications(consultNotifications));
          })
        ).subscribe();

        // io.onChat()
        socketio.onNotification(async (noti: Notification) => {
          const state = store.getState();
          const notiPage = state.notiPage;
          // if (state.doctor?._id === noti.doctorId) return; // skip self-send noti (在不同手机上打开两个相同的app)
          // add the following line if 已经在chat/feedback 页面同病患交互不算新消息。
          // if (noti.patientId === this.pid && noti.type === +this.notiType) return; // skip
          let notifications = [];
          switch (noti.type) {
            case NotificationType.chat:
              notifications = socketio.addNotiToExisted(state.chatNotifications, noti);
              dispatch(updateChatNotifications(notifications));
              if (!notiPage?.patientId || (notiPage.patientId !== noti.patientId && notiPage.type !== noti.type)) {
                pushLocalNotification(noti, 'consult/chat');
              }
              break;

            case NotificationType.adverseReaction:
            case NotificationType.doseCombination:
              notifications = socketio.addNotiToExisted(state.feedbackNotifications, noti);
              dispatch(updateFeedbackNotifications(notifications));
              if (!notiPage?.patientId || (notiPage.patientId !== noti.patientId && notiPage.type !== noti.type)) {
                pushLocalNotification(noti, 'feedback/feedback-chat');
              }
              break;

            case NotificationType.consultChat:
            case NotificationType.consultPhone:
              notifications = socketio.addNotiToExisted(state.consultNotifications, noti);
              dispatch(updateConsultNotifications(notifications));
              if (!notiPage?.patientId || (notiPage.patientId !== noti.patientId && notiPage.type !== noti.type)) {
                pushLocalNotification(noti, 'consult/consult-chat');
              }
              break;
          }
        });
      }
    });

    // push notification
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token || ''));

    return () => {
    }
  }, [store, dispatch]);


  return (
    <NavigationContainer
      ref={navigationRef}
      linking={{
        ...LinkingConfiguration,
        subscribe(listener) {
          const onReceiveURL = ({ url }: { url: string }) => listener(url);
          // const linkTo = useLinkTo();

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
      <Stack.Navigator
        screenOptions={{ headerShown: false }}>
        {!store.getState().isLoggedIn ?
          (
            <Stack.Screen name="SignIn" component={SignInScreen} />
          )
          :
          (
            <Stack.Screen name="Root" component={BottomTabNavigator} />
          )
        }
        <Stack.Screen name="NotFound" component={NotFoundScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const mapState = (state: AppState) => {
  return {
    doctor: state.doctor,
    token: state.token,
    isLoggedIn: state.isLoggedIn,
    notiPage: state.notiPage,
    chatNotifications: state.chatNotifications,
    feedbackNotifications: state.feedbackNotifications,
    consultNotifications: state.consultNotifications,
  }
}

const mapDispatch = {
  updateDoctor,
  updateToken,
  updateIsLoggedIn,
  updateNotiPage,
  updateChatNotifications,
  updateFeedbackNotifications,
  updateConsultNotifications,
}
export default connect(mapState, mapDispatch)(Navigation);


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
    // console.log(token);
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
