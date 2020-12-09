import * as React from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Button, Input } from 'react-native-elements';
import { useRoute } from '@react-navigation/native';
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
import { Ionicons } from '@expo/vector-icons';
import ShortcutBottomMenu from '../../components/chat/ShortcutsBottomMenu';
import EmojiMenu from '../../components/chat/emojiMenu';
import { NotificationType } from '../../models/io/notification.model';
import Spinner from '../../components/shared/Spinner';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native-elements';
import ImageZoomViewer from '../../components/shared/ImageZoomViewer';

export default function ChatScreen() {
  const scrollViewRef = useRef();
  const route = useRoute();
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
  const [isShortcutsMenuVisible, setIsShortcutsMenuVisible] = useState(false);
  const [inputText, setInputText] = useState('')
  const [showEmojis, setShowEmojis] = useState(false)

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
    if (doctor?._id) {
      setLoading(true);
      setType(route.params?.type);
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

    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();

    Keyboard.addListener("keyboardDidShow", scrollToEnd);
    dispatch(UpdateHideBottomBar(true));

    return () => {
      Keyboard.removeListener("keyboardDidShow", scrollToEnd);
      dispatch(UpdateHideBottomBar(false));
    }
  }, [doctor, doctor?._id, route.params?.pid, route.params?.type, dispatch, start]);

  const scrollToEnd = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }

  const onShortcutSelected = useCallback((shortcut) => {
    if (shortcut) {
      setInputText(inputText + shortcut);
    }
    setIsShortcutsMenuVisible(false);
  }, [inputText]);

  const onEmojiSelected = useCallback((emoji) => {
    setInputText(inputText + emoji);
  }, [inputText]);

  const showShortcutsMenu = () => {
    setIsShortcutsMenuVisible(true);
  };

  const toggleEmojis = () => {
    setShowEmojis(!showEmojis);
  }

  const send = (data: string, isImg = false) => {
    if (doctor) {
      setShowEmojis(false);
      switch (type) {
        case NotificationType.chat:
          sendChatMsg(data, isImg);
          break;

        // case NotificationType.adverseReaction:
        // case NotificationType.doseCombination:
        //   this.sendFeedback(imgPath);
        //   break;

        // case NotificationType.consultChat:
        //   this.sendConsult(imgPath);
        //   break;
      }
      setInputText('');
      scrollToEnd();
    }
  }

  const sendChatMsg = (data: string, isImg = false) => {
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
  }
  const [image, setImage] = useState(null);
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const pickCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };
  

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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "position" : 'height'}
        keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 96} >
        <ScrollView ref={scrollViewRef} style={{ marginBottom: Platform.OS === "ios" ? 116 : 88 }}
          onContentSizeChange={scrollToEnd}>
          <View style={styles.chats}>
            {chats.map((chat, i) => (chat.sender === doctor._id ?
              <ChatItem key={i} chat={chat} doctor={doctor} icon={imgPath(doctor.icon)} onImgView={openViewer} ></ChatItem>
              :
              <ChatItem key={i} chat={chat} doctor={doctor} icon={user.icon || ''} onImgView={openViewer}></ChatItem>
            ))
            }
          </View>
          <>{!!image &&
            <Image source={{ uri: image || '' }} style={{ width: 200, height: 200 }} 
            onPress={() => openViewer(image || '')} />
          }</>
        </ ScrollView>
        <SafeAreaView style={styles.fixBottom}>
          <Input
            placeholder="请输入..."
            value={inputText}
            onChangeText={setInputText}
            style={styles.bottomInput}
            multiline={true}
            rightIcon={
              <Button title="发送" containerStyle={{ marginRight: -12 }} buttonStyle={{ paddingLeft: 4, paddingRight: 10 }} icon={{ type: 'ionicon', name: 'ios-paper-plane', color: 'white' }}
                disabled={!inputText} onPress={() => send(inputText)}
              />}
          />

          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: -27, backgroundColor: 'lightgray', paddingVertical: 6, paddingHorizontal: 16 }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'lightgray' }}>
              <Ionicons name="ios-happy" size={26} color="#0095ff"
                style={{ marginRight: 22, color: !showEmojis ? '#0095ff' : 'orange' }} onPress={toggleEmojis}></Ionicons>
              <Ionicons name="ios-image" size={26} color="#0095ff" style={styles.mr3} onPress={pickImage}></Ionicons>
              <Ionicons name="ios-camera" size={26} color="#0095ff" style={styles.mr3} onPress={pickCamera}></Ionicons>
              <Ionicons name="ios-undo" size={26} color="#0095ff" onPress={showShortcutsMenu}></Ionicons>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center', backgroundColor: 'lightgray' }}>
              <Button type="outline" raised={true} buttonStyle={{ paddingVertical: 2, paddingHorizontal: 16 }} title="标识完成"></Button>
              <Button type="outline" raised={true} buttonStyle={{ paddingVertical: 2, paddingHorizontal: 16 }} title="返回付费咨询"></Button>
            </View>
          </View>
          {!!showEmojis &&
            <EmojiMenu onSelect={onEmojiSelected}></EmojiMenu>
          }
          {!!isShortcutsMenuVisible &&
            <ShortcutBottomMenu shortcuts={doctor.shortcuts || ''} onSelect={onShortcutSelected}></ShortcutBottomMenu>
          }
          <ImageZoomViewer img={viewerImg} visible={isOpenViewer} onClose={closeViewer}></ImageZoomViewer>
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
