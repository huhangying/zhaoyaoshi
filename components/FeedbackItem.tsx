import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from './Themed';
import { Doctor } from '../models/crm/doctor.model';
import { Avatar, Image } from 'react-native-elements';
import { imgPath, imgSource } from '../services/core/image.service';
import { UserFeedback } from '../models/io/user-feedback.model';
import { getDateFormat, getDateTimeFormat } from '../services/core/moment';
import { Divider } from 'react-native-paper';
import TextAndEmoji from './shared/TextAndEmoji';

export default function FeedbackItem({ feedback, doctor, icon, onImgView }: { feedback: UserFeedback, doctor: Doctor, icon: string, onImgView: any }) {

  return (
    <View style={feedback.status >= 2 ? styles.alignRight : styles.alignLeft}>
      {!!icon &&
        <Avatar
          containerStyle={styles.icon}
          rounded
          source={{ uri: icon }}
        />
      }
      <View style={feedback.status >= 2 ? styles.sender : styles.to}>

        <View style={{ paddingBottom: 10, backgroundColor: 'transparent' }}>
          <TextAndEmoji data={feedback.name} />
        </View>
        {(feedback.type === 2 && !!feedback.how) && (
          <View style={{ paddingBottom: 10, backgroundColor: 'transparent' }}>
            <TextAndEmoji data={feedback.how} />
          </View>
        )
        }
        {feedback.startDate &&
          <Text style={styles.chatDate}>开始日期：{getDateFormat(feedback.startDate) || '未设置'}</Text>
        }
        {feedback.endDate &&
          <Text style={styles.chatDate}>结束日期：{getDateFormat(feedback.endDate) || '未设置'}</Text>
        }
        {feedback.upload &&
          <Image
            source={imgSource(feedback.upload)}
            style={{ width: 200, height: 200 }}
            onPress={() => onImgView(feedback.upload ? imgPath(feedback.upload) : '')}
          />
        }
        <Divider></Divider>
        <Text style={styles.chatTimestamp}>
          {/* {moment(chat.created).fromNow()} */}
          发送于 {getDateTimeFormat(feedback.createdAt)}
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
  chatDate: {
    color: 'gray',
    fontSize: 12,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 5,
  }

});
