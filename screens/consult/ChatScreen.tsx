import * as React from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Button, Input } from 'react-native-elements';
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
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  const scrollViewRef = useRef();
  const route = useRoute();
  const doctor = useSelector((state: AppState) => state.doctor);
  const [loading, setLoading] = useState(false);
  const initChats: Chat[] = [];
  const [chats, setChats] = useState(initChats);
  const initUser: User = { _id: '' };
  const [user, setUser] = useState(initUser);
  const dispatch = useDispatch();

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

    Keyboard.addListener("keyboardDidShow", scrollToEnd);
    dispatch(UpdateHideBottomBar(true));

    return () => {
      Keyboard.removeListener("keyboardDidShow", scrollToEnd);
      dispatch(UpdateHideBottomBar(false));
    }
  }, [doctor?._id, route.params?.pid, dispatch])

  const scrollToEnd = () => {
    scrollViewRef?.current?.scrollToEnd({ animated: true });
  }

  if (!doctor?._id || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "position" : 'height'}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 96} >
        <ScrollView ref={scrollViewRef} style={{ marginBottom: 56 }}
          onContentSizeChange={scrollToEnd}>
          <View style={styles.chats}>
            {chats.map((chat, i) => (chat.sender === doctor._id ?
              <ChatItem key={i} chat={chat} doctor={doctor} icon={imgPath(doctor.icon)}></ChatItem>
              :
              <ChatItem key={i} chat={chat} doctor={doctor} icon={user.icon || ''}></ChatItem>
            ))
            }
          </View>
        </ ScrollView>
        <SafeAreaView style={styles.fixBottom}>

          {/* <TextInput placeholder="请输入..."
            style={styles.bottomInput}
            multiline={true}
            // leftIcon={<View style={{ flex: 1, flexDirection: 'row'}}><Button title="登录"></Button><Text>ddd</Text></View>}
          /> */}

          <Input placeholder="请输入..."
            style={styles.bottomInput}
            multiline={true}
            rightIcon={<Button title="发送" containerStyle={{marginRight: -12}} buttonStyle={{paddingRight: 14}} icon={{ type: 'ionicon', name: 'ios-paper-plane', color: 'white' }}></Button>}
          />

          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: -27, backgroundColor: 'lightgray', paddingVertical: 6, paddingHorizontal: 16 }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'lightgray' }}>
              <Ionicons name="ios-happy" size={28} color="#0095ff" style={styles.mr3} ></Ionicons>
              <Ionicons name="ios-image" size={28} color="#0095ff" style={styles.mr3}></Ionicons>
              <Ionicons name="ios-undo" size={28} color="#0095ff" ></Ionicons>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignContent:'center', backgroundColor: 'lightgray'}}>
              <Button type="outline" raised={true} buttonStyle={{ paddingVertical: 2, paddingHorizontal: 16}} title="标识完成"></Button>
              <Button type="outline" raised={true} buttonStyle={{ paddingVertical: 2, paddingHorizontal: 16}} title="返回付费咨询"></Button>
            </View>
          </View>

        </SafeAreaView>
      </KeyboardAvoidingView>
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
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'white',
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
  bottomInput: {
    paddingHorizontal: 2,
  },
  mr3: {
    marginRight: 22,
  }

});
