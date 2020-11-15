import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View } from '../../components/Themed';
import { Avatar, Button, Card, Divider, Text } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { imgPath } from '../../services/core/image.service';
import { useEffect } from 'react';
import { getDoctorDetailsById } from '../../services/doctor.service';
import { AppContext } from '../../services/core/state.context';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const store = React.useContext(AppContext);

  useEffect(() => {
    if (store.doctor?._id) {
      getDoctorDetailsById(store.doctor._id).subscribe(doc => {
        store.updateDoctor(doc.data);
      })
    }
    return () => {
    }
  }, [store])

  return (
    <ScrollView>
      <Card containerStyle={{ padding: 10, margin: 0, flex: 1, alignItems: 'center' }} >
        <Avatar
          rounded size="large"
          source={{ uri: imgPath(store.doctor?.icon), }}
        />
        <Text h4>{store.doctor?.name}{store.doctor?.title}</Text>
        <Text h5>{store.doctor?.department?.name}</Text>
      </Card>
      <Divider></Divider>
      <Avatar
        size="xlarge"
        source={{ uri: store.doctor?.qrcode }}
      />
      <Text>
        {JSON.stringify(store.doctor)}
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
