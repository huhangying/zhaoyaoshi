import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Doctor } from '../models/crm/doctor.model';
import { Avatar, Divider, Image } from 'react-native-elements';
import { imgPath, imgSource } from '../services/core/image.service';
import { getDateTimeFormat } from '../services/core/moment';
import TextAndEmoji from './shared/TextAndEmoji';
import { Consult } from '../models/consult/consult.model';

export default function ConsultItem({ consult, doctor, icon, onImgView }: { consult: Consult, doctor: Doctor, icon: string, onImgView: any }) {
  // const screenWidth = useWindowDimensions().width;
  const isDoctor = consult.status && consult.status >= 2;
  const isConsultRequest = consult.disease_types && consult.disease_types?.length > 0;

  return (
    <View style={isDoctor ? styles.alignRight : styles.alignLeft}>
      {!!icon &&
        <Avatar
          containerStyle={styles.icon}
          rounded
          source={{ uri: icon }}
        />
      }

      <View style={isDoctor ? styles.sender : styles.to}>
        {isConsultRequest ? (
          <>
            <Text style={styles.consultType}>
              ***
              {consult.type === 0 ? ' 付费图文咨询 ' : ' 付费电话咨询 '}
              {consult.finished ? ' (已完成) ' : ''}
              ***
            </Text>
            <Text style={styles.consultItem}>
              <Text style={styles.consultItemLabel}>咨询人：</Text>
              {consult.userName}
            </Text>
            <Text style={styles.consultItem}>
              <Text style={styles.consultItemLabel}>疾病类型：</Text>
              {consult.disease_types}
            </Text>
            {(consult.type === 1 && !!consult.cell) && (
              <Text style={styles.consultItem}>
                <Text style={styles.consultItemLabel}>手机：</Text>
                {consult.cell}
              </Text>
            )}
            {(!!consult.address) && (
              <Text style={styles.consultItem}>
                <Text style={styles.consultItemLabel}>地址：</Text>
                {consult.address}
              </Text>
            )}
            <View style={styles.consultItem}>
              <Text style={{ color: 'gray', paddingBottom: 8 }}>问题描述：</Text>
              <TextAndEmoji data={consult.content || ''} />
            </View>
          </>
        ) : (
            <View style={styles.consultItem}>
              <TextAndEmoji data={consult.content || ''} />
            </View>
          )}


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
  },
  consultType: {
    color: '#007bff',
    paddingBottom: 10,
  },
  consultItem: {
    paddingBottom: 6,
  },
  consultItemLabel: {
    color: 'gray',
  }

});
