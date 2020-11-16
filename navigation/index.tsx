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
import { AppContext } from '../services/core/state.context';
import { SocketioService } from '../services/core/socketio.service';
import { Notification, NotificationType } from '../models/io/notification.model';
import { tap } from 'rxjs/operators';
import { AppStoreActionType, appStoreInitialState, appStoreReducer } from '../services/core/app-store.reducer';

const Stack = createStackNavigator();
// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const [auth, setAuth] = React.useState({} as Auth);
  const [state, dispatch] = React.useReducer(appStoreReducer, appStoreInitialState);

  React.useEffect(() => {
    async function fetchData() {
      const _auth = await getAuthState();
      // .then(_auth => {
      setAuth(_auth);
      if (_auth?.doctor?._id) {
        dispatch({ type: AppStoreActionType.UpdateDoctor, payload: _auth.doctor });
        dispatch({ type: AppStoreActionType.UpdateToken, payload: _auth.token });

        // inital store data, only once
        const socketio = new SocketioService(_auth.doctor._id);
        socketio.getUnreadList(_auth.doctor._id).pipe(
          tap(({ chatNotifications, feedbackNotifications, consultNotifications }) => {
            dispatch({ type: AppStoreActionType.UpdateChatNotifications, payload: chatNotifications });
            dispatch({ type: AppStoreActionType.UpdateFeedbackNotifications, payload: feedbackNotifications });
            dispatch({ type: AppStoreActionType.UpdateConsultNotifications, payload: consultNotifications });
          })
        ).subscribe();

        // io.onChat()
        socketio.onNotification((noti: Notification) => {
          // add the following line if 已经在chat/feedback 页面同病患交互不算新消息。
          // if (noti.patientId === this.pid && noti.type === +this.notiType) return; // skip
          let notifications = [];
          switch (noti.type) {
            case NotificationType.chat:
              notifications = socketio.addNotiToExisted(state.chatNotifications, noti);
              dispatch({ type: AppStoreActionType.UpdateChatNotifications, payload: notifications });
              break;
      
            case NotificationType.adverseReaction:
            case NotificationType.doseCombination:
              notifications = socketio.addNotiToExisted(state.feedbackNotifications, noti);
              dispatch({ type: AppStoreActionType.UpdateFeedbackNotifications, payload: notifications });
              break;
      
      
            case NotificationType.consultChat:
            case NotificationType.consultPhone:
              notifications = socketio.addNotiToExisted(state.consultNotifications, noti);
              dispatch({ type: AppStoreActionType.UpdateConsultNotifications, payload: notifications });
              break;
          }
        });
      }
    }

    fetchData();
    return () => {
    }
  }, []);

  return (
    <AppContext.Provider value={state}>
      <NavigationContainer
        linking={LinkingConfiguration}
        theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
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
    </AppContext.Provider>
  );
}
