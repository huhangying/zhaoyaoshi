import * as React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Divider } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { imgPath } from '../../services/core/image.service';
import { useEffect } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Text, View } from '../../components/Themed';
import { AppState } from '../../models/app-state.model';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const doctor = useSelector((state: AppState) => state.doctor);

  useEffect(() => {
    return () => {
    }
  }, [])

  if (!doctor) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <ScrollView>
        <Card containerStyle={{ padding: 10, margin: 0, flex: 1, alignItems: 'center' }} >
          <View>
            <Avatar
              rounded size="large"
              source={{ uri: imgPath(doctor?.icon) }}
            />
            <Text>{doctor?.name}{doctor?.title}</Text>
            <Text>{doctor?.department?.name}</Text>
          </View>
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
