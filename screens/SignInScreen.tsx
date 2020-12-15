import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { Input, Button } from 'react-native-elements';
import { doctorLogin } from '../services/doctor.service';
import { setDoctor, setToken } from '../services/core/local.store';
import { getAuthState, refreshPage } from '../services/core/auth';
import { catchError, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { useNavigation } from '@react-navigation/native';
import Spinner from '../components/shared/Spinner';
import { useEffect, useState } from 'react';

export default function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [hasError, setHasError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const {reset} = useNavigation();
  const [loggedin, setLoggedin] = useState(true)

  useEffect(() => {
    getAuthState().then(_ => {
      if (_?.isLoggedIn) {
        setLoggedin(true)
        reset({ index: 0, routes: [{ name: 'Root' }] });
      } else {
        setLoggedin(false)
      }
    }).catch(err => {
      setLoggedin(false)
    })
    return () => {
    }
  }, [reset])

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
  }

  if (loggedin) {
    return (<Spinner />);
  } else {
    return (
      <>
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
          <View style={{ paddingVertical: 16 }}>
            <Button title="登录" onPress={() => login(username, password)} />
          </View>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>hwem</Text>
        </View>
      </>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    paddingHorizontal: 40,
    paddingTop: 120,
    paddingBottom: 60,
  },
  inputPadding: {
    paddingHorizontal: 10,
  },
  submitStyle: {
    margin: 20,
    flexDirection: "row",
    justifyContent: "flex-end"
  },
  errorMsg: {
    color: 'red',
    paddingHorizontal: 30,
  }
});
