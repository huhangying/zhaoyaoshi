import * as React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Button } from 'react-native-elements';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../models/app-state.model';
import { Chat } from '../../models/io/chat.model';
import { useEffect, useRef, useState } from 'react';
import { getChatHistory } from '../../services/chat.service';
import { tap } from 'rxjs/operators';
import ChatItem from '../../components/ChatItem';
import { getUserDetailsById } from '../../services/user.service';
import { User } from '../../models/crm/user.model';
import { imgPath } from '../../services/core/image.service';
import { UpdateHideBottomBar } from '../../services/core/app-store.actions';

export default function ChatScreen() {
  const scrollViewRef = useRef();
  const route = useRoute();
  const doctor = useSelector((state: AppState) => state.doctor);
  const [loading, setLoading] = useState(false);
  const initChats: Chat[] = [];
  const [chats, setChats] = useState(initChats);
  const initUser: User = { _id: '' };
  const [user, setUser] = useState(initUser);
  const dispatch = useDispatch()

  useEffect(() => {
    if (doctor?._id) {
      setLoading(true);
      getChatHistory(doctor._id, route.params?.pid).pipe(
        tap(_chats => {
          setChats(_chats);
          setLoading(false);
        })
      ).subscribe();
      getUserDetailsById(route.params?.pid).pipe(
        tap(_user => {
          setUser(_user);
        })
      ).subscribe();
    }

    dispatch(UpdateHideBottomBar(true));

    return () => {
      dispatch(UpdateHideBottomBar(false));
    }
  }, [doctor?._id, route.params?.pid, dispatch])

  if (!doctor?._id || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <>
        <ScrollView ref={scrollViewRef} style={{ marginBottom: 50 }}
          onContentSizeChange={() => scrollViewRef?.current?.scrollToEnd({ animated: true })} >
          <View style={styles.chats}>
            {chats.map((chat, i) => (chat.sender === doctor._id ?
              <ChatItem key={i} chat={chat} doctor={doctor} icon={imgPath(doctor.icon)}></ChatItem>
              :
              <ChatItem key={i} chat={chat} doctor={doctor} icon={user.icon || ''}></ChatItem>
            ))
            }
          </View>
        </ ScrollView>
        <View style={styles.fixBottom}>
          <Text>dsfsd</Text>
        </View>
      </>
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
  chats: {
    // flex: 1,
    flexDirection: 'column-reverse',
  },
  fixBottom: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'lightblue'
  },

});
