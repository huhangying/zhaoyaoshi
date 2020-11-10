import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View } from '../../components/Themed';
import { Avatar, Button, Card, Divider, Text } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDoctor } from '../../services/core/local.store';
import { AuthContext } from '../../services/core/auth';
import { imgPath } from '../../services/core/image.service';
import { useEffect } from 'react';
import { getDoctorDetailsById } from '../../services/doctor.service';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const auth = React.useContext(AuthContext);
  const [doctor, setDoctor] = React.useState(auth.doctor);
  useEffect(() => {
    if (auth.doctor?._id) {
      getDoctorDetailsById(auth.doctor._id).then(doc => {
        setDoctor(doc);
      })
    }
    return () => {

    }
  }, [])

  return (
    <ScrollView>
      <Card containerStyle={{ padding: 10, margin: 0, flex: 1, alignItems:'center' }} >
        <Avatar
          rounded size="large"
          source={{ uri: imgPath(auth.doctor?.icon), }}
        />
        <Text h3>{auth.doctor?.name}{auth.doctor?.title}</Text>
        <Text h4>{doctor?.department?.name}</Text>
      </Card>
      <Divider></Divider>
      <Avatar
        size="xlarge"
        source={{ uri: doctor?.qrcode }}
      />
      <Text>
        {JSON.stringify(doctor)}
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
