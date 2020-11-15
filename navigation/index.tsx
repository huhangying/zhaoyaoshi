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
import { AppStoreService } from '../services/core/app-store.service';
import { SocketioService } from '../services/core/socketio.service';
import { Notification } from '../models/io/notification.model';

const Stack = createStackNavigator();
// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const [auth, setAuth] = React.useState({} as Auth);
  const [store, setStore] = React.useState(new AppStoreService());
  // const store = new AppStoreService();


  

  React.useEffect(() => {
    // inital store data, only once
    getAuthState().then(_auth => {
      setAuth(_auth);
      if (_auth?.doctor?._id) {
        store.updateDoctor(_auth.doctor);
        store.updateToken(_auth.token);
        setStore(store);

        const socketio = new SocketioService(_auth.doctor._id);
        // io.onChat()
        socketio.onNotification((noti: Notification) => {
          // add the following line if 已经在chat/feedback 页面同病患交互不算新消息。
          // if (noti.patientId === this.pid && noti.type === +this.notiType) return; // skip
          socketio.addNotification(noti, store);
        });
      }
    });


    return () => {
    }
  }, [])

  return (
    <AppContext.Provider value={store}>
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
