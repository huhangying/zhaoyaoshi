import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Text, ListItem, Header, Button } from 'react-native-elements';
import { Notification, NotificationType } from '../models/io/notification.model';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import Constants from "expo-constants";

export default function NotificationList({ list, title, onClose }: { list: Notification[], title: string, onClose: any }) {
  const { navigate } = useNavigation();

  const chatNavigate = (noti: Notification) => {
    if (noti) {
      switch (noti.type) {
        case NotificationType.chat:
          navigate('ChatScreen', { pid: noti.patientId, type: noti.type, title: noti.name + ' 免费咨询' });
          break;
        case NotificationType.consultChat:
          navigate('ConsultScreen', { pid: noti.patientId, type: noti.type, title: noti.name + ' 付费图文咨询' });
          break;
        case NotificationType.consultPhone:
          navigate('ConsultScreen', { pid: noti.patientId, type: noti.type, title: noti.name + ' 付费电话咨询' });
          break;
        case NotificationType.doseCombination:
          navigate('FeedbackChatScreen', { pid: noti.patientId, type: noti.type, title: noti.name + ' 联合用药反馈' });
          break;
        case NotificationType.adverseReaction:
          navigate('FeedbackChatScreen', { pid: noti.patientId, type: noti.type, title: noti.name + ' 不良反应反馈' });
          break;
      }
      onClose(); // close noti modal
    }
  }

  const renderNotiTitle = (noti: Notification) => {
    let msgTypeTitle = '条新消息';
    switch (noti.type) {
      case NotificationType.consultChat:
        msgTypeTitle = '个图文咨询';
        break;
      case NotificationType.consultPhone:
        msgTypeTitle = '个电话咨询';
        break;
      case NotificationType.adverseReaction:
        msgTypeTitle = '个不良反应反馈';
        break;
      case NotificationType.doseCombination:
        msgTypeTitle = '个联合用药反馈';
        break;
    }
    return <ListItem.Title>{noti.name}发送了 {noti.count} {msgTypeTitle}</ListItem.Title>;
  }

  return (
    <View style={styles.container}>
      <Header
        leftComponent={{ icon: 'notifications', color: '#fff' }}
        centerComponent={{ text: title, style: { color: '#fff' } }}
        rightComponent={{ icon: 'close', color: '#fff', onPress: onClose }}
      />
      <ScrollView>
        {
          list.map((noti, i) => (
            <ListItem key={i} bottomDivider 
            style={{marginTop: 4}}
            onPress={() => chatNavigate(noti)}>
              <ListItem.Content>
                {
                  renderNotiTitle(noti)
                }
                <ListItem.Content>
                  <Text style={styles.textHint}>发送于{moment(noti.created).format('YYYY年MM月DD日')}</Text>
                </ListItem.Content>
              </ListItem.Content>
              <ListItem.Chevron type='ionicon' name="ios-arrow-forward" size={24} color="gray" />
            </ListItem>
          ))
        }
      </ScrollView>
      <View style={styles.fixBottom}>
        <Button
          title='关闭'
          onPress={() => onClose()}>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -Constants.statusBarHeight,
    backgroundColor: 'whitesmoke',
    // height: '100%'
  },
  textHint: {
    paddingHorizontal: 16,
    paddingTop: 8,
    color: 'gray',
    fontSize: 12,
  },
  fixBottom: {
    position: 'absolute',
    margin: 24,
    right: 0,
    left: 0,
    bottom: 0,
  },
});
