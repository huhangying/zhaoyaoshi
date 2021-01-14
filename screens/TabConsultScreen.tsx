import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Modal } from 'react-native';
import { Text } from '../components/Themed';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { AppState } from '../models/app-state.model';
import { ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { Caption } from 'react-native-paper';
import NotificationList from '../components/NotificationList';
import { Notification, NotificationType } from '../models/io/notification.model';
import Spinner from '../components/shared/Spinner';
import { useCallback, useState } from 'react';
import NotificationBadge from '../components/shared/NotificationBadge';
import { updateSnackbar } from '../services/core/app-store.actions';

export default function TabConsultScreen() {
  const { navigate } = useNavigation();
  const { doctor, chatNotifications, consultNotifications } = useSelector((state: AppState) => state);
  const store = useStore();
  const dispatch = useDispatch()

  const [notiVisible, setNotiVisible] = useState(false);
  const [notiTitle, setNotiTitle] = useState('');
  const [notiList, setNotiList] = useState([{}]);
  const onNotiModalClose = useCallback(() => {
    setNotiVisible(false);
  }, []);

  const closeNotification = () => setNotiVisible(false);
  const openNotification = (title: string, notiList: Notification[]) => {
    if (notiList.length < 1) {
      dispatch(updateSnackbar('您暂无病患' + title))
      return;
    }
    setNotiVisible(true);
    setNotiTitle(title);
    setNotiList(notiList);
  }

  if (!doctor) {
    return (<Spinner />);
  } else {
    return (
      <>
        <Text> </Text>
        <ListItem key={'noti-consult' + 0} bottomDivider onPress={() => navigate('SelectChatScreen')}>
          <Ionicons name="ios-chatbubbles" size={24} color="limegreen" />
          <ListItem.Content>
            <ListItem.Title>在线咨询</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <Caption style={styles.m3}>咨询消息提醒</Caption>
        <ListItem key={'noti-consult' + 1} bottomDivider
          onPress={() => openNotification('付费图文咨询提醒', consultNotifications?.filter(_ => _.type === NotificationType.consultChat) || [])}>
          <Ionicons name="ios-megaphone" size={24} color="coral"></Ionicons>
          <ListItem.Content>
            <ListItem.Title>
              付费图文咨询提醒
              <NotificationBadge notiLength={consultNotifications?.filter(_ => _.type === NotificationType.consultChat)?.length}></NotificationBadge>
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <Text> </Text>
        <ListItem key={'noti-consult' + 2} bottomDivider
          onPress={() => openNotification('付费电话咨询提醒', consultNotifications?.filter(_ => _.type === NotificationType.consultPhone) || [])}>
          <Ionicons name="ios-call" size={24} color="coral"></Ionicons>
          <ListItem.Content>
            <ListItem.Title>
              付费电话咨询提醒
              <NotificationBadge notiLength={consultNotifications?.filter(_ => _.type === NotificationType.consultPhone)?.length}></NotificationBadge>
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <Text> </Text>
        <ListItem key={3}
          onPress={() => openNotification('免费咨询消息提醒', chatNotifications || [])}>
          <Ionicons name="ios-notifications" size={24} color="turquoise"></Ionicons>
          <ListItem.Content>
            <ListItem.Title>
              免费咨询消息提醒
              <NotificationBadge notiLength={chatNotifications?.length}></NotificationBadge>
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <Modal visible={notiVisible}
          animationType="slide" transparent={true}
          statusBarTranslucent={true}
          hardwareAccelerated={true}
          onDismiss={closeNotification}>
          <NotificationList list={notiList} title={notiTitle} onClose={onNotiModalClose} />
        </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  m3: {
    margin: 18,
    marginVertical: 16
  },
});
