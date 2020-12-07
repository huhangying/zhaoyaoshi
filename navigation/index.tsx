import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import SignInScreen from '../screens/SignInScreen';
import { getAuthState } from '../services/core/auth';
import { Auth } from '../models/auth.model';
import { SocketioService } from '../services/core/socketio.service';
import { Notification, NotificationType } from '../models/io/notification.model';
import { tap } from 'rxjs/operators';
import { connect, useStore } from 'react-redux';
import { useDispatch } from 'react-redux'
import { updateChatNotifications, updateConsultNotifications, updateDoctor, updateFeedbackNotifications, updateToken } from '../services/core/app-store.actions';
import { AppState } from "../models/app-state.model";

const Stack = createStackNavigator();
// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {

  const store = useStore();
  const [auth, setAuth] = React.useState({} as Auth);
  const dispatch = useDispatch();

  React.useEffect(() => {
    // const _auth = await getAuthState();
    getAuthState().then(_auth => {
      setAuth(_auth);
      if (_auth?.doctor?._id) {
        dispatch(updateDoctor(_auth.doctor));
        dispatch(updateToken(_auth.token));

        // inital store data, only once
        const socketio = new SocketioService(_auth.doctor._id);
        socketio.getUnreadList(_auth.doctor._id).pipe(
          tap(({ chatNotifications, feedbackNotifications, consultNotifications }) => {
            dispatch(updateChatNotifications(chatNotifications));
            dispatch(updateFeedbackNotifications(feedbackNotifications));
            dispatch(updateConsultNotifications(consultNotifications));
          })
        ).subscribe();

        // io.onChat()
        socketio.onNotification((noti: Notification) => {
          // add the following line if 已经在chat/feedback 页面同病患交互不算新消息。
          // if (noti.patientId === this.pid && noti.type === +this.notiType) return; // skip
          let notifications = [];
          switch (noti.type) {
            case NotificationType.chat:
              notifications = socketio.addNotiToExisted(store.getState().chatNotifications, noti);
              dispatch(updateChatNotifications(notifications));
              break;

            case NotificationType.adverseReaction:
            case NotificationType.doseCombination:
              notifications = socketio.addNotiToExisted(store.getState().feedbackNotifications, noti);
              dispatch(updateFeedbackNotifications(notifications));
              break;

            case NotificationType.consultChat:
            case NotificationType.consultPhone:
              notifications = socketio.addNotiToExisted(store.getState().consultNotifications, noti);
              dispatch(updateConsultNotifications(notifications));
              break;
          }
        });
      }
    });

    return () => {
    }
  }, [store, dispatch]);

  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}>
        {!auth?.isLoggedIn ?
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
    chatNotifications: state.chatNotifications,
    feedbackNotifications: state.feedbackNotifications,
    consultNotifications: state.consultNotifications,
  }
}

const mapDispatch = {
  updateDoctor,
  updateToken,
  updateChatNotifications,
  updateFeedbackNotifications,
  updateConsultNotifications,
}
export default connect(mapState, mapDispatch)(Navigation);