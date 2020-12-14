import * as React from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { View } from '../../components/Themed';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../models/app-state.model';
import { Chat, ChatType } from '../../models/io/chat.model';
import { useCallback, useEffect, useRef, useState } from 'react';
import { getChatHistory, sendChat } from '../../services/chat.service';
import { take, tap } from 'rxjs/operators';
import ChatItem from '../../components/ChatItem';
import { getUserDetailsById } from '../../services/user.service';
import { User } from '../../models/crm/user.model';
import { imgPath } from '../../services/core/image.service';
import { UpdateHideBottomBar } from '../../services/core/app-store.actions';
import { NotificationType } from '../../models/io/notification.model';
import Spinner from '../../components/shared/Spinner';
import ImageZoomViewer from '../../components/shared/ImageZoomViewer';
import ChatInputs from '../../components/shared/ChatInputs';

export default function ChatScreen() {
  const scrollViewRef = useRef<ScrollView>();
  const route = useRoute();
  const dimensions = useWindowDimensions();
  const doctor = useSelector((state: AppState) => state.doctor);
  const ioService = useSelector((state: AppState) => state.ioService);
  const [type, setType] = useState(NotificationType.chat);
  const [pid, setPid] = useState('');
  const [loading, setLoading] = useState(false);
  const initChats: Chat[] = [];
  const [chats, setChats] = useState(initChats);
  const initUser: User = { _id: '' };
  const [user, setUser] = useState(initUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // 监听呼入消息
  const start = ioService?.onChat((msg: Chat) => {
    if (msg.sender === pid) {
      const _chats = [...chats];
      _chats.unshift(msg);
      setChats(_chats);
      scrollToEnd();
    }
  });

  useEffect(() => {
    const pid = route.params?.pid;
    const title = route.params?.title;
    const type = route.params?.type;
    navigation.setOptions({ headerTitle: title });
    if (doctor?._id) {
      setLoading(true);
      setType(type);
      setPid(pid);
      getChatHistory(doctor._id, pid).pipe(
        take(1),
        tap(_chats => {
          setChats(_chats);
          setLoading(false);
        })
      ).subscribe();
      getUserDetailsById(pid).pipe(
        take(1),
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
  }, [doctor, doctor?._id, route.params?.pid, route.params?.type, route.params?.title, navigation, dispatch, start]);

  const scrollToEnd = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }

  const onSend = useCallback((data: string, isImg = false) => {
    if (!doctor) {
      return;
    }
    const chat = {
      room: doctor._id,
      sender: doctor._id || '',
      senderName: doctor.name || '',
      to: pid,
      type: !isImg ? ChatType.text : ChatType.picture,
      data: data,
      cs: false// this.isCs
    };
    const _chats = [...chats];
    _chats.unshift(chat);
    setChats(_chats);
    // setChats([...chats, chat]);

    ioService?.sendChat(doctor._id, chat);
    sendChat(chat).subscribe(); // chatService
    scrollToEnd();
  }, [chats, doctor, ioService, pid]);


  const [isOpenViewer, setIsOpenViewer] = useState(false);
  const [viewerImg, setViewerImg] = useState('');
  const openViewer = useCallback((img: string) => {
    setIsOpenViewer(true);
    setViewerImg(img);
  }, []);
  const closeViewer = () => {
    setIsOpenViewer(false);
    setViewerImg('');
  }

  if (!doctor?._id || loading) {
    return <Spinner />;
  } else {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "position" : 'height'}
        keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 96} >
        <ScrollView ref={scrollViewRef} style={{ marginBottom: Platform.OS === "ios" ? 102 : 88, minHeight: dimensions.height - 190 }}
          onContentSizeChange={scrollToEnd}>
          <View style={styles.chats}>
            {chats.map((chat, i) => (chat.sender === doctor._id ?
              <ChatItem key={i} chat={chat} doctor={doctor} icon={imgPath(doctor.icon)} onImgView={openViewer} ></ChatItem>
              :
              <ChatItem key={i} chat={chat} doctor={doctor} icon={user.icon || ''} onImgView={openViewer}></ChatItem>
            ))
            }
          </View>
        </ ScrollView>
        <ChatInputs pid={pid} doctor={doctor} onSend={onSend}></ChatInputs>
        <ImageZoomViewer img={viewerImg} visible={isOpenViewer} onClose={closeViewer}></ImageZoomViewer>

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
  chats: {
    flex: 1,
    flexDirection: 'column-reverse',
  },
});
