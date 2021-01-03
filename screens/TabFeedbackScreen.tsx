import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, Modal, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../models/app-state.model';
import { ListItem } from 'react-native-elements';
import { Fontisto, Ionicons } from '@expo/vector-icons';
import { Caption } from 'react-native-paper';
import NotificationList from '../components/NotificationList';
import { Notification, NotificationType } from '../models/io/notification.model';
import Spinner from '../components/shared/Spinner';
import { useCallback, useState } from 'react';
import NotificationBadge from '../components/shared/NotificationBadge';
import { updateSnackbar } from '../services/core/app-store.actions';

export default function TabFeedbackScreen() {
  const { navigate } = useNavigation();
  const store = useSelector((state: AppState) => state);
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
      dispatch(updateSnackbar(`您暂无${title}提醒`))
      return;
    }
    setNotiVisible(true);
    setNotiTitle(title);
    setNotiList(notiList);
  }
  const getDoseCombinationNotis = () => {
    return store.feedbackNotifications?.filter((_: Notification) => _.type === NotificationType.doseCombination) || [];
  }
  const getAdverseReactionNotis = () => {
    return store.feedbackNotifications?.filter((_: Notification) => _.type === NotificationType.adverseReaction) || [];
  }


  if (!store?.doctor) {
    return (<Spinner />);
  } else {
    return (
      <>
        <Text> </Text>
        <ListItem key={0} bottomDivider onPress={() => navigate('BookingsScreen')}>
          <Ionicons name="ios-calendar" size={24} color="orange" />
          <ListItem.Content>
            <ListItem.Title>门诊预约</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <Caption style={styles.m3}>门诊病患用药反馈提醒</Caption>
        <ListItem key={1} bottomDivider
          onPress={() => openNotification('联合用药反馈', getDoseCombinationNotis())}>
          <Fontisto name="pills" size={24} color="lightblue"></Fontisto>
          <ListItem.Content>
            <ListItem.Title>
              联合用药反馈提醒
              <NotificationBadge notiLength={getDoseCombinationNotis()?.length}></NotificationBadge>              
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <Text> </Text>
        <ListItem key={2}
          onPress={() => openNotification('不良反应反馈', getAdverseReactionNotis())}>
          <Fontisto name="frowning" size={24} color="gray"></Fontisto>
          <ListItem.Content>
            <ListItem.Title>
              不良反应反馈提醒
              <NotificationBadge notiLength={getAdverseReactionNotis()?.length}></NotificationBadge>
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
