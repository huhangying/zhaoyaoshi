import * as React from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
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
import { UpdateHideBottomBar, updateNotiPage } from '../../services/core/app-store.actions';
import { NotificationParams, NotificationType } from '../../models/io/notification.model';
import Spinner from '../../components/shared/Spinner';
import ImageZoomViewer from '../../components/shared/ImageZoomViewer';
import ChatInputs from '../../components/shared/ChatInputs';
import { Header } from 'react-native-elements';
import ChatMenuActions from '../../components/ChatMenuActions';
import { checkConsultExistsByDoctorIdAndUserId } from '../../services/consult.service';
import { ExistedConsult } from '../../models/consult/consult.model';
import { iconPath } from '../../services/core/image.service';

export default function ChatScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
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
  const [title, setTitle] = useState('')
  const initExistedConsult: ExistedConsult = {exists: false};
  const [existedConsult, setExistedConsult] = useState(initExistedConsult)

  // 监听呼入消息
  const start = ioService?.onChat((msg: Chat) => {
    if (type === NotificationType.chat &&
      msg.to === doctor?._id && msg.sender === pid) {
      const _chats = [...chats];
      _chats.unshift(msg);
      setChats(_chats);
      scrollToEnd();
    }
  });

  useEffect(() => {
    const { pid, title, type } = route.params as NotificationParams;
    setTitle(title);
    // navigation.setOptions({ headerTitle: title });
    if (doctor?._id) {
      setLoading(true);
      setType(type);
      setPid(pid);

      getChatHistory(doctor._id, pid).pipe(
        tap(_chats => {
          setChats(_chats);
          setLoading(false);
        })
      ).subscribe();

      getUserDetailsById(pid).pipe(
        tap(_user => {
          setUser(_user);
        })
      ).subscribe();

      if (doctor.prices && doctor.prices?.length > 0) {
        // 付费咨询正在进行中
        checkConsultExistsByDoctorIdAndUserId(doctor._id, pid).pipe(
          tap((rsp: ExistedConsult) => {
            setExistedConsult(rsp);
          }),
        ).subscribe();
      }
    }

    Keyboard.addListener("keyboardDidShow", scrollToEnd);
    dispatch(UpdateHideBottomBar(true));
    dispatch(updateNotiPage({ patientId: pid, type, doctorId: doctor?._id })); // set noti page

    return () => {
      Keyboard.removeListener("keyboardDidShow", scrollToEnd);
      dispatch(UpdateHideBottomBar(false));
      dispatch(updateNotiPage()); // clean noti page
    }
  }, [doctor, doctor?._id, route.params, navigation, dispatch, start]);

  const scrollToEnd = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }

  const onSend = useCallback((data: string, isImg = false, isCmd = false) => {
    if (!doctor) {
      return;
    }
    const chat: Chat = {
      room: doctor._id,
      sender: doctor._id || '',
      senderName: doctor.name || '',
      to: pid,
      type: !isCmd ? (!isImg ? ChatType.text : ChatType.picture) : ChatType.command,
      data: data,
      created: new Date(),
      cs: false// this.isCs
    };
    const _chats = [...chats];
    _chats.unshift(chat);
    setChats(_chats);

    ioService?.sendChat(doctor._id, chat);
    sendChat(chat).subscribe(); // chatService
    scrollToEnd();
    Keyboard.dismiss();
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
        behavior={Platform.OS === "ios" ? "height" : 'height'}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0} >
        <Header
          placement="left"
          leftComponent={{ icon: 'chevron-left', style: { marginTop: -4 }, size: 28, color: '#fff', onPress: navigation.goBack }}
          centerComponent={{ text: decodeURIComponent(title), style: { color: '#fff', fontSize: 18 }, onPress: navigation.goBack }}
        />

        <ScrollView ref={scrollViewRef}
          style={{ marginBottom: Platform.OS === "ios" ? 119 : 88, maxHeight: dimensions.height - 145 }}
          onContentSizeChange={scrollToEnd}>
          <View style={styles.chats}>
            {chats.map((chat, i) => (chat.sender === doctor._id ?
              <ChatItem key={'cid' + i} chat={chat} doctor={doctor} icon={iconPath(doctor?.icon)} onImgView={openViewer} ></ChatItem>
              :
              <ChatItem key={'ciu' + i} chat={chat} doctor={doctor} icon={user.icon || ''} onImgView={openViewer}></ChatItem>
            ))
            }
          </View>
        </ ScrollView>

        <ChatInputs pid={pid} doctor={doctor} type={type} onSend={onSend} existsConsult={existedConsult?.exists} consultId={existedConsult?.consultId}></ChatInputs>
        <ImageZoomViewer img={viewerImg} visible={isOpenViewer} onClose={closeViewer}></ImageZoomViewer>
        <ChatMenuActions pid={pid} type={type} doctorId={doctor?._id} existedConsult={existedConsult} userName={user?.name} />

      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  chats: {
    flex: 1,
    flexDirection: 'column-reverse',
  },
});
