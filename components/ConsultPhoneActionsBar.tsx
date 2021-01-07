import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { NotificationType } from '../models/io/notification.model';
import { Button, Divider } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../models/app-state.model';
import { updateConsultNotifications, updateSnackbar } from '../services/core/app-store.actions';
import { setConsultDoneByDocterUserAndType } from '../services/consult.service';
import { Doctor } from '../models/crm/doctor.model';
import { sendWechatMsg } from '../services/weixin.service';
import { MessageType } from '../models/app-settings.model';

export default function ConsultPhoneActionsBar({ type, pid, openid, id, doctor, userName, consultReject }:
  {
    pid: string, type: NotificationType, openid?: string, id?: string,
    doctor?: Doctor, userName?: string, consultReject: any
  }) {
  const state = useSelector((state: AppState) => state);
  const { navigate } = useNavigation();
  const dispatch = useDispatch()


  const textReply = () => {
    navigate('ConsultScreen', {
      pid: pid, type: NotificationType.consultChat,
      title: userName + ' 付费咨询',
      id: id,
      fromConsultPhone: true
    });
  }

  // 药师标识完成
  const markDone = () => {
    if (doctor?._id) {
      // 付费咨询：标记已读，并从提醒列表里去除
      const notifications = state.consultNotifications?.filter(_ => _.patientId !== pid || _.type !== type) || [];// type=5 or 6
      // save back
      dispatch(updateConsultNotifications(notifications));

      // mark read in db
      setConsultDoneByDocterUserAndType(doctor?._id, pid, 1).subscribe();  // type=0: 图文

      // 发送微信消息
      if (doctor && openid && userName) {
        sendWechatMsg(openid,
          '药师咨询完成',
          `${doctor.name}${doctor.title}已完成咨询。请点击查看，并建议和评价药师。`,
          `${doctor.wechatUrl}consult-finish?doctorid=${doctor._id}&openid=${openid}&state=${doctor.hid}&id=${id}&type=1`,
          '',
          doctor._id,
          userName
        ).subscribe();
      }
      dispatch(updateSnackbar('药师标记图文咨询已经完成', MessageType.success))
    }
  }

  return (
    <SafeAreaView style={styles.fixBottom}>
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        <Button title="咨询拒绝" type="outline"
          titleStyle={{ color: 'orange', fontSize: 12 }}
          buttonStyle={{ paddingLeft: 4, paddingRight: 12 }}
          icon={{ type: 'ionicon', name: 'ios-close-circle-outline', color: 'orange' }}
          onPress={consultReject}
        />

        <Button title="图文回复" type="outline"
          titleStyle={{ fontSize: 12 }}
          buttonStyle={{ paddingLeft: 4, paddingRight: 12 }}
          icon={{ type: 'ionicon', name: 'ios-close-circle-outline', color: '#2f95dc' }}
          onPress={textReply}
        />

        <Button title="标记完成"
          titleStyle={{ fontSize: 12 }}
          buttonStyle={{ paddingLeft: 4, paddingRight: 12 }}
          icon={{ type: 'ionicon', name: 'ios-checkmark-circle-outline', color: 'white' }}
          onPress={markDone}
        />
      </View>
      <Divider></Divider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fixBottom: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'white',
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
  bottomInput: {
    paddingHorizontal: 2,
  },
});
