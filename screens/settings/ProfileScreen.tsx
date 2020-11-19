import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Divider, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { imgPath } from '../../services/core/image.service';
import { useEffect } from 'react';
import { useDispatch, useStore } from 'react-redux';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const doctor = useStore().getState().doctor;

  useEffect(() => {
    return () => {
    }
  }, [])

  return (
    <ScrollView>
      <Card containerStyle={{ padding: 10, margin: 0, flex: 1, alignItems: 'center' }} >
        <Avatar
          rounded size="large"
          source={{ uri: imgPath(doctor.icon) }}
        />
        <Text h4>{doctor?.name}{doctor?.title}</Text>
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
