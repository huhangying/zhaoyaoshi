import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';
import 'moment/locale/zh-cn'
import moment from 'moment';
import { Chat, ChatCommandTypeMap, ChatType } from '../models/io/chat.model';
import { Doctor } from '../models/crm/doctor.model';
import { Avatar, Image } from 'react-native-elements';
import { imgPath } from '../services/core/image.service';
import { chatDataList, isEmoji, getEmojiPath } from './ChatHelper';
moment.locale('zh-cn');

export default function ChatItem({ chat, doctor, icon }: { chat: Chat, doctor: Doctor, icon: string }) {

  return (

    <View style={chat.sender === doctor._id ? styles.alignRight : styles.alignLeft}>
      {!!icon &&
        <Avatar
          containerStyle={styles.icon}
          rounded
          source={{ uri: icon }}
        />
      }
      <View style={chat.sender === doctor._id ? styles.sender : styles.to}>
        {(() => {
          switch (chat.type) {
            case ChatType.picture:
              return (!!chat.data &&
                <Image
                  source={{ uri: imgPath(chat.data) }}
                  style={{ width: 200, height: 200 }}
                />)
            case ChatType.text:
              return (
                <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'transparent' }}>
                  {chatDataList(chat.data).map((text, i) => (isEmoji(text) ? (
                    <Image key={i}
                      source={{ uri: (getEmojiPath(text)) }} style={{ width: 20, height: 20 }} />
                  ) : (
                      <Text key={i}>
                        {text}
                      </Text>
                    )
                  ))
                  }
                </View>
              )
            case ChatType.command:
              return (
                <Text>
                  **** {ChatCommandTypeMap[chat.data]} ****
                </Text>
              )
          }
        })()}
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