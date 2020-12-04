import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';
import 'moment/locale/zh-cn'
import moment from 'moment';
import { Chat } from '../models/io/chat.model';
import { Doctor } from '../models/crm/doctor.model';
import { Avatar } from 'react-native-elements';
moment.locale('zh-cn');

export default function ChatItem({ chat, doctor, icon }: { chat: Chat, doctor: Doctor, icon: string }) {

  return (

    <View style={chat.sender === doctor._id ? styles.alignRight : styles.alignLeft}>
      {icon &&
        <Avatar
          containerStyle={styles.icon}
          rounded
          source={{ uri: icon }}
        />
      }
      <View style={chat.sender === doctor._id ? styles.sender : styles.to}>
        <Text>
          {chat.data}
        </Text>
        <Text style={styles.chatTimestamp}>
          {/* {moment(chat.created).fromNow()} */}
          {moment(chat.created).format('LL a h:mm')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginTop: 10,
    marginHorizontal: 4,
  },
  chatTimestamp: {
    color: 'gray',
    fontSize: 12,
    textAlign: 'right',
    paddingHorizontal: 8,
    paddingTop: 6,
    paddingBottom: 0,
  },
  fixBottom: {
    position: 'absolute',
    margin: 24,
    right: 0,
    left: 0,
    bottom: 0,
  },

  sender: {
    paddingTop: 10,
    paddingBottom: 4,
    paddingHorizontal: 14,
    backgroundColor: 'lightblue',
    marginVertical: 4,
    marginRight: 2,
    borderRadius: 10,
  },
  to: {
    paddingTop: 10,
    paddingBottom: 4,
    paddingHorizontal: 14,
    backgroundColor: 'lightyellow',
    marginVertical: 4,
    marginLeft: 2,
    borderRadius: 10,
  },
  alignLeft: {
    flex: 1,
    flexDirection: 'row',
  },
  alignRight: {
    flex: 1,
    flexDirection: 'row-reverse',
  },

});
