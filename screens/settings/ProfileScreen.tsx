import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View } from '../../components/Themed';
import { Avatar, Button, Card, Divider, Text } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { imgPath } from '../../services/core/image.service';
import { useEffect } from 'react';
import { getDoctorDetailsById } from '../../services/doctor.service';
import { AppContext } from '../../services/core/state.context';
import { AppStoreActionType, appStoreInitialState, appStoreReducer } from '../../services/core/app-store.reducer';
import { distinctUntilChanged } from 'rxjs/operators';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const appState = React.useContext(AppContext);
  const [state, dispatch] = React.useReducer(appStoreReducer, appState);

  useEffect(() => {
    if (state.doctor?._id) {
      getDoctorDetailsById(state.doctor._id).pipe(
        distinctUntilChanged()
      ).subscribe(doc => {
        dispatch({type: AppStoreActionType.UpdateDoctor, payload: doc});
        // state.updateDoctor(doc);
      })
    }
    return () => {
    }
  }, [])

  return (
    <ScrollView>
      <Card containerStyle={{ padding: 10, margin: 0, flex: 1, alignItems: 'center' }} >
        <Avatar
          rounded size="large"
          source={{ uri: imgPath(state.doctor?.icon), }}
        />
        <Text h4>{state.doctor?.name}{state.doctor?.title}</Text>
        <Text h4>{state.doctor?.department?.name}</Text>
      </Card>
      <Divider></Divider>
      <Avatar
        size="xlarge"
        source={{ uri: state.doctor?.qrcode }}
      />
      <Text>
        {JSON.stringify(state.doctor)}
      </Text>
      <Button
        title="Go to ChatScreen... again"
        onPress={() => navigation.navigate('ChatScreen', { id: '几点开始了对方' })}
      />

      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
      />

      <Button
        title="Go feedback"
        onPress={() => navigation.navigate('feedback', { screen: 'TabFeedbackScreen' })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
