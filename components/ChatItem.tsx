import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { View } from './Themed';
import { Chat, ChatCommandTypeMap, ChatType } from '../models/io/chat.model';
import { Doctor } from '../models/crm/doctor.model';
import { Image } from 'react-native-elements';
import { imgPath, imgSource } from '../services/core/image.service';
import TextAndEmoji from './shared/TextAndEmoji';
import { getDateTimeFormat } from '../services/core/moment';
import AvatarIcon from './shared/AvatarIcon';

export default function ChatItem({ chat, doctor, icon, onImgView }: { chat: Chat, doctor: Doctor, icon?: string, onImgView: any }) {
  const isDoctor = chat.sender === doctor._id;
  return (
    <View style={isDoctor ? styles.alignRight : styles.alignLeft}>
      <AvatarIcon icon={icon} isDoctor={isDoctor} />
      <View style={isDoctor ? styles.sender : styles.to}>
        {(() => {
          switch (chat.type) {
            case ChatType.picture:
              return (!!chat.data &&
                <Image
                  source={imgSource(chat.data)}
                  style={{ width: 200, height: 200 }}
                  onPress={() => onImgView(chat.data ? imgPath(chat.data) : '')}
                />
              )
            case ChatType.text:
              return (
                <TextAndEmoji data={chat.data} />
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
          {getDateTimeFormat(chat.created)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
    paddingHorizontal: 10,
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
