import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, ListItem, Header, Button } from 'react-native-elements';
import { Notification, NotificationType } from '../models/io/notification.model';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';

export default function NotificationList({ list, title, onClose }: { list: Notification[], title: string, onClose: any }) {
  const { navigate } = useNavigation();

  const chatNavigate = (noti: Notification) => {
    if (noti) {
      switch (noti.type) {
        case NotificationType.chat:
          navigate('ChatScreen', { pid: noti.patientId, type: noti.type });
          break;
        case NotificationType.consultChat:
        case NotificationType.consultPhone:
          navigate('ConsultScreen', { pid: noti.patientId, type: noti.type });
          break;
        case NotificationType.doseCombination:
        case NotificationType.adverseReaction:
          navigate('FeedbackChatScreen', { pid: noti.patientId, type: noti.type });
          break;
      }
      onClose(); // close noti modal
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'whitesmoke' }}>
      <Header
        leftComponent={{ icon: 'notifications', color: '#fff' }}
        centerComponent={{ text: title, style: { color: '#fff' } }}
        rightComponent={{ icon: 'close', color: '#fff', onPress: onClose }}
      />
      <ScrollView>
        {
          list.map((noti, i) => (
            <ListItem key={i} bottomDivider onPress={() => chatNavigate(noti)}>
              <ListItem.Content>
                <ListItem.Title>{noti.name}发送了 {noti.count} 条新消息</ListItem.Title>
                <ListItem.Content>
                  <Text style={[styles.textHint, styles.px3]}>发送于{moment(noti.created).format('YYYY年MM月DD日')}</Text>
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
  px3: {
    paddingHorizontal: 16
  },
  textHint: {
    color: 'gray',
    fontSize: 12
  },
  fixBottom: {
    position: 'absolute',
    margin: 24,
    right: 0,
    left: 0,
    bottom: 0,
  },
});
