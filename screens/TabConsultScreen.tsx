import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, Modal, StyleSheet } from 'react-native';

import { View } from '../components/Themed';
import { useSelector } from 'react-redux';
import { AppState } from '../models/app-state.model';
import { Badge, ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import { Text, Caption } from 'react-native-paper';
import NotificationList from '../components/NotificationList';
import { Notification } from '../models/io/notification.model';
import { getUnreadCount } from '../services/notification.service';

export default function TabConsultScreen() {
  const { navigate } = useNavigation();
  const { doctor, chatNotifications, feedbackNotifications, consultNotifications } = useSelector((state: AppState) => state);

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

  if (!doctor) {
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
          <Ionicons name="ios-chatbubbles" size={24} color="limegreen" />
          <ListItem.Content>
            <ListItem.Title>在线咨询</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <Caption style={styles.m3}>咨询消息提醒</Caption>
        <ListItem key={1} bottomDivider
          onPress={() => openNotification('付费咨询消息提醒', consultNotifications || [])}>
          <Ionicons name="ios-megaphone" size={24} color="coral"></Ionicons>
          <ListItem.Content>
            <ListItem.Title>
              付费咨询消息提醒&nbsp;&nbsp;
              <Badge status="success" value={consultNotifications?.length}></Badge>
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <Text> </Text>
        <ListItem key={2}
          onPress={() => openNotification('免费咨询消息提醒', chatNotifications || [])}>
          <Ionicons name="ios-notifications" size={24} color="turquoise"></Ionicons>
          <ListItem.Content>
            <ListItem.Title>
              免费咨询消息提醒&nbsp;&nbsp;
              <Badge status="success" value={chatNotifications?.length}></Badge>
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <Text style={styles.m3}>
          {getUnreadCount(chatNotifications)} |
          {getUnreadCount(feedbackNotifications)} |
          {getUnreadCount(consultNotifications)} |
          {doctor?.title} |
        </Text>

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
