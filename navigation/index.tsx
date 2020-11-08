import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import SignInScreen from '../screens/SignInScreen';
import { getAuthState } from '../services/core/auth';

const AuthContext = React.createContext(getAuthState);

// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const auth = React.useContext(AuthContext);
  return (
    <AuthContext.Provider value={auth}>
      <NavigationContainer
        linking={LinkingConfiguration}
        theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootNavigator />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator();

function RootNavigator() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  // const auth = React.useContext(AuthContext);
  // auth.then(_ => {
  //   console.log(_.isLoggedIn);
  //   setIsLoggedIn(_.isLoggedIn);
  // });

  React.useEffect(() => {
    getAuthState().then(_ => {
      console.log(_.isLoggedIn);
      setIsLoggedIn(_.isLoggedIn);
    })
    return () => {      
    }
  }, [])

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ?
        (
          <Stack.Screen name="SignIn" component={SignInScreen} />
        )
        :
        (
          <Stack.Screen name="Root" component={BottomTabNavigator} />
        )
      }
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}
