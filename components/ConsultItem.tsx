import React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from './Themed';
import { Doctor } from '../models/crm/doctor.model';
import { Avatar, Image } from 'react-native-elements';
import { imgPath, imgSource } from '../services/core/image.service';
import { getDateTimeFormat } from '../services/core/moment';
import { Divider } from 'react-native-paper';
import TextAndEmoji from './shared/TextAndEmoji';
import { Consult } from '../models/consult/consult.model';

export default function ConsultItem({ consult, doctor, icon, onImgView }: { consult: Consult, doctor: Doctor, icon: string, onImgView: any }) {

  return (
    <View style={(consult.status && consult.status >= 2) ? styles.alignRight : styles.alignLeft}>
      {!!icon &&
        <Avatar
          containerStyle={styles.icon}
          rounded
          source={{ uri: icon }}
        />
      }
      <View style={(consult.status && consult.status >= 2) ? styles.sender : styles.to}>
        {(!!consult.disease_types?.length) && (
          <Text style={{ paddingBottom: 10, backgroundColor: 'transparent' }}>
            {consult.cell}
          </Text>
        )
        }
        <View style={{ paddingBottom: 10, backgroundColor: 'transparent' }}>
          <TextAndEmoji data={consult.content || ''} />
        </View>
        {(consult.type === 1 && !!consult.cell) && (
          <Text style={{ paddingBottom: 10, backgroundColor: 'transparent' }}>
            {consult.cell}
          </Text>
        )
        }
        {(!!consult.address) && (
          <Text style={{ paddingBottom: 10, backgroundColor: 'transparent' }}>
            {consult.address}
          </Text>
        )
        }

        {consult.upload &&
          <Image
            source={imgSource(consult.upload)}
            style={{ width: 200, height: 200 }}
            onPress={() => onImgView(consult.upload ? imgPath(consult.upload) : '')}
          />
        }
        <Divider></Divider>
        <Text style={styles.chatTimestamp}>
          {/* {moment(chat.created).fromNow()} */}
          发送于 {getDateTimeFormat(consult.createdAt)}
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
