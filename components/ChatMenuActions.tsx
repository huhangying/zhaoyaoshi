import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Menu, Provider } from 'react-native-paper';
import { NotificationType } from '../models/io/notification.model';
import { Button, Divider, Icon } from 'react-native-elements';
import { ExistedConsult } from '../models/consult/consult.model';
import { useNavigation } from '@react-navigation/native';
import { setReadByDocterAndPatient } from '../services/chat.service';
import { setReadByDocterPatientAndType } from '../services/user-feedback.service';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../models/app-state.model';
import { updateChatNotifications, updateConsultNotifications, updateFeedbackNotifications, updateSnackbar } from '../services/core/app-store.actions';
import { setConsultDoneByDocterUserAndType } from '../services/consult.service';
import { Doctor } from '../models/crm/doctor.model';
import { sendWechatMsg } from '../services/weixin.service';

export default function ChatMenuActions({ type, pid, doctorId, openid, id, existedConsult, doctor, userName }:
  {
    pid: string, type: NotificationType, doctorId: string, openid?: string, id?: string,
    existedConsult?: ExistedConsult, doctor?: Doctor, userName?: string
  }) {
  const state = useSelector((state: AppState) => state);
  const [visible, setVisible] = React.useState(false);
  const { navigate } = useNavigation();
  const dispatch = useDispatch()

  const openMenu = () => {
    setVisible(true);
  }

  const closeMenu = () => setVisible(false);

  const goBackConsult = () => {
    const type = existedConsult?.type;
    // 付费图文咨询 （共用chat）
    if (type === NotificationType.consultChat) {
      navigate('ConsultScreen', {
        pid: pid, type: NotificationType.consultChat,
        title: userName + ' 付费图文咨询', id: existedConsult?.consultId
      });
    } else if (type === NotificationType.consultPhone) {
      // 付费电话咨询，到说明页面
      // navigate(['/main/consult-phone'], {
      //   queryParams: {
      //     pid: this.selectedPatient?._id,
      //     id: this.existedConsultId
      //   }
      // });
    }
    closeMenu();
  }

  // 药师标识完成
  const markDone = () => {

    switch (type) {
      case NotificationType.chat: // NotificationType.customerService
        if (state.chatNotifications?.length) {
          const notifications = state.chatNotifications.filter(_ => _.patientId !== pid);
          // save back
          dispatch(updateChatNotifications(notifications));

          // mark read in db
          setReadByDocterAndPatient(doctorId, pid).subscribe();
        }
        break;

      case NotificationType.adverseReaction:
      case NotificationType.doseCombination:
        if (state.feedbackNotifications?.length) {
          const notifications = state.feedbackNotifications.filter(_ => _.patientId !== pid || _.type !== type);
          // save back
          dispatch(updateFeedbackNotifications(notifications));

          // mark read in db
          setReadByDocterPatientAndType(doctorId, pid, type).subscribe();
        }
        break;

      case NotificationType.consultChat:
        if (state.consultNotifications?.length) {
          // 付费咨询：标记已读，并从提醒列表里去除
          const notifications = state.consultNotifications.filter(_ => _.patientId !== pid || _.type !== type);// type=5 or 6
          // save back
          dispatch(updateConsultNotifications(notifications));

          // mark read in db
          setConsultDoneByDocterUserAndType(doctorId, pid, 0).subscribe();  // type=0: 图文

          // 发送微信消息
          if (doctor && openid && userName) {
            sendWechatMsg(openid,
              '药师咨询完成',
              `${doctor.name}${doctor.title}已完成咨询。请点击查看，并建议和评价药师。`,
              `${doctor.wechatUrl}consult-finish?doctorid=${doctor._id}&openid=${openid}&state=${doctor.hid}&id=${id}&type=0`,
              '',
              doctor._id,
              userName
            ).subscribe();
          }
          dispatch(updateSnackbar('药师标记图文咨询已经完成'))
        }
        closeMenu();
        return;

      default:
        return;
    }

    dispatch(updateSnackbar('药师标记消息已处理！'))
    closeMenu();
  }

  return (
    <View style={{ position: 'absolute', right: 10, top: 45 }}>
      <Provider>
        <View
          style={{
            paddingTop: 0,
            flexDirection: 'row',
            justifyContent: 'flex-end',
            // backgroundColor: 'lightblue',
            backgroundColor: 'transparent',
            width: 200,
            height: 200,
          }}>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <Button
                type="clear"
                icon={<Icon name="menu" size={24} color="white" />}
                style={{ alignContent: 'center', alignSelf: 'center' }}
                onPress={openMenu} />
            }
            style={{ marginTop: 0, position: 'absolute', right: 0, left: 0, top: 40, zIndex: 99999, elevation: 9999 }}
          >

            <Menu.Item icon="check-circle" onPress={() => { markDone() }} title="标识完成" />
            <View style={{
              display: (type === NotificationType.chat && existedConsult && existedConsult.exists) ? 'flex' : 'none'
            }}>
              <Divider />
              <Menu.Item icon="keyboard-backspace" onPress={goBackConsult} title="返回付费咨询" />
            </View>
          </Menu>
        </View>
      </Provider>
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

});
