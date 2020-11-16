import * as React from 'react';
// import { useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { Input, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { doctorLogin } from '../services/doctor.service';
import { setDoctor, setToken } from '../services/core/local.store';
import { refreshPage } from '../services/core/auth';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

export default function SignInScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [hasError, setHasError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  // const authContext = React.useMemo(authMethods, []);
  // const AuthContext = React.createContext(authContext);
  // const { signIn } = React.useContext(AuthContext);

  const login = (username: string, password: string) => {
    if (!username || !password) {
      setHasError(true);
      setErrorMessage('请输入用户名和密码。');
      return;
    }

    doctorLogin(username, password).pipe(
      tap(async result => {
        await setToken(result.token);
        delete result.token;
        await setDoctor(result);
        refreshPage();
      }),
      catchError(err => {
        setHasError(true);
        setErrorMessage('用户名或者密码错误。');
        return EMPTY;
      })
    ).subscribe();
    // .then(async result => {
    //   if (result?.return) {
    //     setHasError(true);
    //     setErrorMessage('用户名或者密码错误。');
    //     return;
    //   }
    //   await setToken(result.token);
    //   delete result.token;
    //   await setDoctor(result);
    //   refreshPage();
    //   // navigation.navigate('Root');
    //   // navigation.navigate('NotFound');
    // })
    // .catch(err => {
    //   setHasError(true);
    //   setErrorMessage('用户名或者密码错误。');
    // });
  }

  return (
    <View style={styles.container}>
      <Input
        placeholder="用户名"
        leftIcon={{ type: 'ionicon', name: 'md-person', color: '#2f95dc', size: 30 }}
        style={styles.inputPadding}
        value={username}
        onChangeText={setUsername} autoCompleteType='name'
      />
      <Input
        placeholder="密码"
        leftIcon={{ type: 'ionicon', name: 'md-lock', color: '#2f95dc', size: 30 }}
        style={styles.inputPadding}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <>
        {hasError ?
          <Text style={styles.errorMsg}>{errorMessage}</Text> : null
        }
      </>
      <View>
        <Button title="登录" onPress={() => login(username, password)} titleStyle={styles.paddingX} containerStyle={styles.submitStyle} />
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 50,
  },
  inputPadding: {
    paddingHorizontal: 10,
  },
  submitStyle: {
    margin: 20,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  paddingX: {
    paddingHorizontal: 30,
  },
  errorMsg: {
    color: 'red',
    paddingHorizontal: 30,
  }
});
