import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { Button, StyleSheet } from 'react-native';
import { Divider, Header } from 'react-native-elements';
import { useSelector, useStore } from 'react-redux';
import EditTextList from '../components/EditTextList';

import { Text, View } from '../components/Themed';
import { AppState } from '../models/app-state.model';
import { getUnreadCount } from '../services/notification.service';

export default function TabConsultScreen() {
  const navigation = useNavigation();
  const store = useStore();
  const state = useSelector((state: AppState) => state);
  const onListSave = React.useCallback(newList => {
    console.log('You clicked ', newList);
  }, []);

  return (
    <>
      <Header
        statusBarProps={{ barStyle: 'light-content' }}
        barStyle="light-content" // or directly
        leftComponent={{ icon: 'home', style: { color: '#fff' } }}
        centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
        containerStyle={{
          backgroundColor: '#3D6DCC',
          justifyContent: 'space-around',
        }}
      />
      <EditTextList list={['a', 'b', 'c']} onListSave={onListSave} />
      <Divider style={{ backgroundColor: 'lightgray' }} />
      <View style={styles.container}>
        <Text style={styles.title}>{state.doctor?.name}</Text>
        <Text>
          {getUnreadCount(state.chatNotifications)} |
          {getUnreadCount(state.feedbackNotifications)} |
          {getUnreadCount(state.consultNotifications)} |
          {store.getState().doctor?.title} |
        </Text>

        <Button title="go chat" onPress={() => {
          // navigation.setOptions
          navigation.navigate('ChatScreen');
        }} />
      </View>
      <Divider></Divider>
    </>
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
