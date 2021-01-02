import * as React from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../models/app-state.model';
import { useCallback, useEffect, useRef, useState } from 'react';
import { take, tap } from 'rxjs/operators';
import { getUserDetailsById } from '../../services/user.service';
import { User } from '../../models/crm/user.model';
import { imgPath } from '../../services/core/image.service';
import { UpdateHideBottomBar, updateNotiPage } from '../../services/core/app-store.actions';
import { NotificationType } from '../../models/io/notification.model';
import Spinner from '../../components/shared/Spinner';
import ImageZoomViewer from '../../components/shared/ImageZoomViewer';
import ChatInputs from '../../components/shared/ChatInputs';
import { getByFeedbacksByUserIdDoctorId, sendFeedback } from '../../services/user-feedback.service';
import { UserFeedback } from '../../models/io/user-feedback.model';
import FeedbackItem from '../../components/FeedbackItem';
import { Header } from 'react-native-elements';
import ChatMenuActions from '../../components/ChatMenuActions';
import { View } from 'react-native';

export default function FeedbackChatScreen() {
  const scrollViewRef = useRef<ScrollView>();
  const route = useRoute();
  const dimensions = useWindowDimensions();
  const doctor = useSelector((state: AppState) => state.doctor);
  const ioService = useSelector((state: AppState) => state.ioService);
  const [type, setType] = useState(NotificationType.chat);
  const [pid, setPid] = useState('');
  const [loading, setLoading] = useState(false);
  const initFeedbacks: UserFeedback[] = [];
  const [feedbacks, setFeedbacks] = useState(initFeedbacks);
  const initUser: User = { _id: '' };
  const [user, setUser] = useState(initUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [title, setTitle] = useState('')

  // 监听呼入消息
  const start = ioService?.onFeedback((msg: UserFeedback) => {
    if ((type === NotificationType.adverseReaction || type === NotificationType.doseCombination) &&
      msg.doctor === doctor?._id && msg.user === pid) {
      const _feedbacks = [...feedbacks];
      _feedbacks.push(msg);
      setFeedbacks(_feedbacks);
      scrollToEnd();
    }
  });

  useEffect(() => {
    const pid = route.params?.pid;
    const title = route.params?.title;
    const type = route.params?.type;
    setTitle(title);
    navigation.setOptions({ headerTitle: title }); // to remove
    if (doctor?._id) {
      setLoading(true);
      setType(type);
      setPid(pid);

      // get history
      getByFeedbacksByUserIdDoctorId(doctor._id, pid, type).pipe(
        take(1),
        tap(_feedbacks => {
          setFeedbacks(_feedbacks);
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
    dispatch(updateNotiPage({ patientId: pid, type, doctorId: doctor?._id })); // set noti page

    return () => {
      Keyboard.removeListener("keyboardDidShow", scrollToEnd);
      dispatch(UpdateHideBottomBar(false));
      dispatch(updateNotiPage()); // clean noti page
    }
  }, [doctor, doctor?._id, route.params?.pid, route.params?.type, route.params?.title, navigation, dispatch, start]);

  const scrollToEnd = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }

  const onSend = useCallback((data: string, isImg = false) => {
    if (!doctor) {
      return;
    }
    const feedback: UserFeedback = isImg ? {
      // room: doctor._id,
      doctor: doctor._id || '',
      senderName: doctor.name || '',
      user: pid,
      type: type,
      name: '请参阅图片',
      upload: data,
      status: 2,
      createdAt: new Date()
    } : { // text
        user: pid,
        doctor: doctor._id,
        senderName: doctor.name || '',
        type: type,
        name: data,
        status: 2,
        createdAt: new Date()
      };
    const _feedbacks = [...feedbacks];
    _feedbacks.push(feedback);
    setFeedbacks(_feedbacks);

    ioService?.sendFeedback(doctor._id, feedback);
    sendFeedback(feedback).subscribe(); // chatService
    scrollToEnd();
    Keyboard.dismiss();
  }, [feedbacks, doctor, ioService, pid, type]);


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
          leftComponent={{ icon: 'chevron-left', color: '#fff', onPress: navigation.goBack }}
          centerComponent={{ text: title, style: { color: '#fff' } }}
        />
        <ScrollView ref={scrollViewRef}
          style={{ marginBottom: Platform.OS === "ios" ? 119 : 88, maxHeight: dimensions.height - 145 }}
          onContentSizeChange={scrollToEnd}>
          <View style={styles.feedbacks}>
            {feedbacks.map((feedback, i) => (feedback.status >= 2 ?
              <FeedbackItem key={i} feedback={feedback} doctor={doctor} icon={imgPath(doctor.icon)} onImgView={openViewer} ></FeedbackItem>
              :
              <FeedbackItem key={i} feedback={feedback} doctor={doctor} icon={user.icon || ''} onImgView={openViewer}></FeedbackItem>
            ))
            }
          </View>
        </ ScrollView>
        <ChatInputs pid={pid} doctor={doctor} onSend={onSend}></ChatInputs>
        <ImageZoomViewer img={viewerImg} visible={isOpenViewer} onClose={closeViewer}></ImageZoomViewer>
        <ChatMenuActions type={type} doctor={doctor} />

      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  feedbacks: {
    flex: 1,
    flexDirection: 'column',
  },
});
