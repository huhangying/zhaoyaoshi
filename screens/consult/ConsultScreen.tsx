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
import { NotificationParams, NotificationType } from '../../models/io/notification.model';
import Spinner from '../../components/shared/Spinner';
import ImageZoomViewer from '../../components/shared/ImageZoomViewer';
import ChatInputs from '../../components/shared/ChatInputs';
import { Header } from 'react-native-elements';
import ChatMenuActions from '../../components/ChatMenuActions';
import { View } from 'react-native';
import { Consult } from '../../models/consult/consult.model';
import { GetConsultsByDoctorIdAndUserId, GetConsultsByDoctorIdUserIdAndType, sendConsult } from '../../services/consult.service';
import ConsultItem from '../../components/ConsultItem';

export default function ConsultScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const route = useRoute();
  const dimensions = useWindowDimensions();
  const doctor = useSelector((state: AppState) => state.doctor);
  const ioService = useSelector((state: AppState) => state.ioService);
  const [type, setType] = useState(NotificationType.chat);
  const [pid, setPid] = useState('');
  const [consultId, setConsultId] = useState('')
  const [loading, setLoading] = useState(false);
  const initConsults: Consult[] = [];
  const [consults, setConsults] = useState(initConsults);
  const initUser: User = { _id: '' };
  const [user, setUser] = useState(initUser);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [title, setTitle] = useState('')

  // 监听呼入消息
  const start = ioService?.onConsult((msg: Consult) => {
    if ((type === NotificationType.consultChat || type === NotificationType.consultPhone) &&
      msg.doctor === doctor?._id && msg.user === pid) {
      const _consults = [...consults];
      _consults.push(msg);
      setConsults(_consults);
      scrollToEnd();
    }
  });

  useEffect(() => {
    const {pid, title, type, id} = route.params as NotificationParams;
    setTitle(title);
    if (doctor?._id) {
      setLoading(true);
      setType(type);
      setPid(pid);
      setConsultId(id || '');

      // get history
      if (type === NotificationType.consultChat) {
        GetConsultsByDoctorIdAndUserId(doctor._id, pid).pipe(
          take(1),
          tap(_consults => {
            setConsults(_consults);
            setLoading(false);
          })
        ).subscribe();
      } else { // ?
        GetConsultsByDoctorIdUserIdAndType(doctor._id, pid, type).pipe(
          take(1),
          tap(_consults => {
            setConsults(_consults);
            setLoading(false);
          })
        ).subscribe();
      }

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
  }, [doctor, doctor?._id, route.params, navigation, dispatch, start]);

  const scrollToEnd = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }

  const onSend = useCallback((data: string, isImg = false) => {
    if (!doctor) {
      return;
    }
    const consult: Consult = isImg ? {
      // room: doctor._id,
      doctor: doctor._id || '',
      userName: user.name || '',
      user: pid,
      type: type,
      content: '请参阅图片',
      upload: data,
      status: 2,
      createdAt: new Date()
    } : { // text
        user: pid,
        doctor: doctor._id,
        userName: user.name || '',
        type: type,
        content: data,
        status: 2,
        createdAt: new Date()
      };
    const _consults = [...consults];
    _consults.push(consult);
    setConsults(_consults);

    ioService?.sendConsult(doctor._id, consult);
    sendConsult(consult).subscribe(); // chatService
    scrollToEnd();
    Keyboard.dismiss();
  }, [consults, doctor, ioService, pid, type, user]);


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
          leftComponent={{ icon: 'chevron-left', style: {marginTop: -4}, size: 28, color: '#fff', onPress: navigation.goBack }}
          centerComponent={{ text: title, style: { color: '#fff', fontSize: 18 }, onPress: navigation.goBack }}
        />
        <ScrollView ref={scrollViewRef}
          style={{ marginBottom: Platform.OS === "ios" ? 119 : 88, maxHeight: dimensions.height - 145 }}
          onContentSizeChange={scrollToEnd}>
          <View style={styles.item}>
            {consults.map((consult, i) => (consult.status && consult.status >= 2 ?
              <ConsultItem key={i} consult={consult} doctor={doctor} icon={imgPath(doctor.icon)} onImgView={openViewer} ></ConsultItem>
              :
              <ConsultItem key={i} consult={consult} doctor={doctor} icon={user.icon || ''} onImgView={openViewer}></ConsultItem>
            ))
            }
          </View>
        </ ScrollView>
        <ChatInputs pid={pid} doctor={doctor} onSend={onSend}></ChatInputs>
        <ImageZoomViewer img={viewerImg} visible={isOpenViewer} onClose={closeViewer}></ImageZoomViewer>
        <ChatMenuActions pid={pid} type={type} doctorId={doctor?._id} openid={user.link_id} id={consultId} doctor={doctor} userName={user?.name} />

      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1,
    flexDirection: 'column',
  },
});
