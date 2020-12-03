import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Modal, StyleSheet } from 'react-native';

import { View } from '../components/Themed';
import { useSelector } from 'react-redux';
import { AppState } from '../models/app-state.model';
import { Badge, ListItem } from 'react-native-elements';
import { Fontisto, Ionicons } from '@expo/vector-icons';
import { Text, Caption } from 'react-native-paper';
import NotificationList from '../components/NotificationList';
import { Notification, NotificationType } from '../models/io/notification.model';

export default function TabFeedbackScreen() {
  const { navigate } = useNavigation();
  const store = useSelector((state: AppState) => state);

  const [notiVisible, setNotiVisible] = React.useState(false);
  const [notiTitle, setNotiTitle] = React.useState('');
  const [notiList, setNotiList] = React.useState([{}]);
  const onNotiModalClose = React.useCallback(() => {
    setNotiVisible(false);
  }, []);

  const closeNotification = () => setNotiVisible(false);
  const openNotification = (title: string, notiList: Notification[]) => {
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
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
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
        <Caption style={styles.m3}>门诊病患用药反馈</Caption>
        <ListItem key={1} bottomDivider
          onPress={() => openNotification('联合用药反馈', getDoseCombinationNotis())}>
          <Fontisto name="pills" size={24} color="lightblue"></Fontisto>
          <ListItem.Content>
            <ListItem.Title>
              联合用药反馈
              <Badge status="success" value={getDoseCombinationNotis()?.length}></Badge>
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
              不良反应反馈
              <Badge status="success" value={getAdverseReactionNotis()?.length}></Badge>
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>

        <Modal visible={notiVisible} animationType="slide" transparent={true} onDismiss={closeNotification}>
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
