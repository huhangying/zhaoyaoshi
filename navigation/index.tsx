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

const Stack = createStackNavigator();
// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const [auth, setAuth] = React.useState({} as Auth);
  const [count, setCount] = React.useState(0);
  let temp = 0
  const [store, setStore] = React.useState(new AppStoreService());
  // const store = new AppStoreService();


  React.useEffect(() => {
    getAuthState().then(_ => {
      setAuth(_);
      if (_?.doctor) {
        store.updateDoctor(_.doctor);
        store.updateToken(_.token);
        setStore(store);  
      }
    });

    // inital store data

    const counter = setInterval(() => {
      // console.log(count + 1);
      // setCount(count + 1);
    }, 1000);
    return () => {
      clearInterval(counter);
    }
  }, [count])

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
