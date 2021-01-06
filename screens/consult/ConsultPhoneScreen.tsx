import * as React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { AppState } from '../../models/app-state.model';
import { useCallback, useEffect, useRef, useState } from 'react';
import { take, tap } from 'rxjs/operators';
import { getUserDetailsById } from '../../services/user.service';
import { User } from '../../models/crm/user.model';
import { NotificationParams, NotificationType } from '../../models/io/notification.model';
import Spinner from '../../components/shared/Spinner';
import ImageZoomViewer from '../../components/shared/ImageZoomViewer';
import { Header } from 'react-native-elements';
import { View } from 'react-native';
import { Consult } from '../../models/consult/consult.model';
import { getConsultById} from '../../services/consult.service';
import ConsultItem from '../../components/ConsultItem';
import ConsultPhoneActionsBar from '../../components/ConsultPhoneActionsBar';

export default function ConsultPhoneScreen() {
  const scrollViewRef = useRef<ScrollView>(null);
  const route = useRoute();
  const dimensions = useWindowDimensions();
  const doctor = useSelector((state: AppState) => state.doctor);
  const [type, setType] = useState(NotificationType.chat);
  const [pid, setPid] = useState('');
  // const [consultId, setConsultId] = useState('')
  const [loading, setLoading] = useState(false);
  const initConsult: Consult = { user: '', doctor: '' };
  const [consult, setConsult] = useState(initConsult);
  const initUser: User = { _id: '' };
  const [user, setUser] = useState(initUser);
  const navigation = useNavigation();
  const [title, setTitle] = useState('')


  useEffect(() => {
    const { pid, title, type, id } = route.params as NotificationParams;
    setTitle(title);
    if (doctor?._id) {
      setLoading(true);
      setType(type);
      setPid(pid);
      // setConsultId(id || '');

      if (id) {
        // get details
        getConsultById(id).pipe(
          take(1),
          tap(_consult => {
            _consult.content = `sldks;d
            sd
            f
            sd
            f
            sd
            f
            sd
            sd
            fsd

            fs
            d
            fsdfsd

            sdf
            sd

            wer
            ew
            rwe

            rew

            
            f
            sd
            f
            sd
            f
            sf
            dsf
            `;
            setConsult(_consult);
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

    return () => {
    }
  }, [doctor, doctor?._id, route.params, navigation]);


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
        behavior={'height'}
        keyboardVerticalOffset={0} >
        <Header
          placement="left"
          leftComponent={{ icon: 'chevron-left', style: { marginTop: -4 }, size: 28, color: '#fff', onPress: navigation.goBack }}
          centerComponent={{ text: decodeURIComponent(title), style: { color: '#fff', fontSize: 18 }, onPress: navigation.goBack }}
        />
        <ScrollView ref={scrollViewRef}
          style={{ marginBottom: 62, maxHeight: dimensions.height - 145 }}
          >
          <View style={styles.item}>
            <ConsultItem key={0} consult={consult} doctor={doctor} icon={user.icon || ''} onImgView={openViewer}></ConsultItem>
          </View>
        </ ScrollView>
        <ConsultPhoneActionsBar pid={pid} doctor={doctor} type={type} id={consult?._id} userName={user.name}></ConsultPhoneActionsBar>
        <ImageZoomViewer img={viewerImg} visible={isOpenViewer} onClose={closeViewer}></ImageZoomViewer>

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
