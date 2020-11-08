import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import SignInScreen from '../screens/SignInScreen';
import { AuthContext, getAuthState } from '../services/core/auth';
import { Auth } from '../models/auth.model';

const Stack = createStackNavigator();

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const [authData, setAuthData] = React.useState({} as Auth);

  React.useEffect(() => {
    getAuthState().then(_ => {
      console.log(_.isLoggedIn);
      setAuthData(_);
    })
    return () => {
    }
  }, [])

  return (
    <AuthContext.Provider value={authData}>
      <NavigationContainer
        linking={LinkingConfiguration}
        theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!authData?.isLoggedIn ?
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
    </AuthContext.Provider>
  );
}
