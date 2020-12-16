import * as React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from '../components/Themed';
import { Input, Button } from 'react-native-elements';
import { doctorLogin } from '../services/doctor.service';
import { setDoctor, setToken } from '../services/core/local.store';
import { getAuthState, refreshPage } from '../services/core/auth';
import { catchError, map, tap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { useNavigation } from '@react-navigation/native';
import Spinner from '../components/shared/Spinner';
import { useEffect, useState } from 'react';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';
import { getHospitalList } from '../services/hospital.service';
import { Hospital } from '../models/hospital/hospital.model';

export default function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [hasError, setHasError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const { reset } = useNavigation();
  const [loggedin, setLoggedin] = useState(true)
  const [hid, setHid] = useState(0);
  const initHospitalList: Item[] = [];
  const [hospitalList, setHospitalList] = useState(initHospitalList)

  const prepareData = () => {
    setLoggedin(false)

    getHospitalList().pipe(
      map(results => {
        // convert to {label: string;  value: any;}
        if (results?.length) {
          const items = results.map(hospital => ({ label: hospital.name, value: hospital.hid } as Item));
          setHospitalList(items);
        }
      })
    ).subscribe();
  }

  useEffect(() => {
    getAuthState().then(_ => {
      if (_?.isLoggedIn) {
        setLoggedin(true)
        reset({ index: 0, routes: [{ name: 'Root' }] });
      } else {
        prepareData();
      }
    }).catch(err => {
      prepareData();
    })
    return () => {
    }
  }, [reset])

  const login = (hid: number, username: string, password: string) => {
    if (!hid) {
      setHasError(true);
      setErrorMessage('请选择您所在的医院。');
      return;
    }
    if (!username || !password) {
      setHasError(true);
      setErrorMessage('请输入用户名和密码。');
      return;
    }

    doctorLogin(hid, username, password).pipe(
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
          <View style={{
            flex: 0, flexDirection: 'row', paddingBottom: 8, marginHorizontal: 10, borderBottomWidth: 0.5, borderColor: 'gray', marginBottom: 18
          }}>
            <Ionicons name="ios-business" size={30} color="#2f95dc" style={{ marginRight: 10 }} />
            <View style={{ flex: 1 }}>
              <RNPickerSelect
                placeholder={{
                  label: '请选择您所在的医院',
                  fontSize: 14,
                  value: 0,
                  color: '#8EA0A4',
                }}
                items={hospitalList}
                onValueChange={(value) => { setHid(value); }}
                InputAccessoryView={() => null}
                style={{
                  ...pickerSelectStyles,
                  iconContainer: {
                    top: 14,
                    right: 10,
                  },
                  placeholder: {
                    color: 'gray',
                    fontSize: 16,
                    fontWeight: 'bold',
                  },
                }}
                useNativeAndroidPickerStyle={false}
                Icon={() => {
                  return (
                    <View
                      style={{
                        backgroundColor: 'transparent',
                        borderTopWidth: 10,
                        borderTopColor: 'lightgray',
                        borderRightWidth: 10,
                        borderRightColor: 'transparent',
                        borderLeftWidth: 10,
                        borderLeftColor: 'transparent',
                        width: 0,
                        height: 0,
                      }}
                    />
                  );
                }}
              />
            </View>
          </View>

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
            <Button title="登录" onPress={() => login(hid, username, password)} />
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
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 18,
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    alignSelf: 'stretch'
  },
  inputAndroid: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
