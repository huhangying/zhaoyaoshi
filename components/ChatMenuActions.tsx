import React, { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
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
import { Notification } from "../models/io/notification.model";
import { MessageType } from '../models/app-settings.model';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ChatMenuActions({ type, pid, doctorId, openid, id,
  existedConsult, doctor, userName, fromConsultPhone, onConsultReject }:
  {
    pid: string, type: NotificationType, doctorId: string, openid?: string, id?: string,
    existedConsult?: ExistedConsult, doctor?: Doctor, userName?: string, fromConsultPhone?: boolean,
    onConsultReject?: any
  }) {
  const state = useSelector((state: AppState) => state);
  const [visible, setVisible] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false);
  const { navigate } = useNavigation();
  const dispatch = useDispatch()
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const hasNewServices = (pid: string) => {
      if (!pid) return false;
      let notifications: Notification[] = [];
      switch (type) {
        case NotificationType.chat: // NotificationType.customerService
          notifications = state.chatNotifications || [];
          break;

        case NotificationType.adverseReaction:
        case NotificationType.doseCombination:
          notifications = state.feedbackNotifications?.filter(_ => _.type === type) || [];
          break;

        case NotificationType.consultChat:
          notifications = state.consultNotifications || [];
          break;
      }
      if (!notifications?.length) return false;
      return notifications.findIndex(noti => noti.patientId === pid) > -1;
    }

    setVisible(hasNewServices(pid));
    return () => {
    }
  }, [pid, type, state])

  const openMenu = () => setMenuOpen(true);
  const closeMenu = () => setMenuOpen(false);

  const goBackConsult = (forceToConsultPhone?: boolean, id?: string) => {
    const type = !forceToConsultPhone ? existedConsult?.type: 1;
    // 付费图文咨询 （共用chat）
    if (type === NotificationType.consultChat) {
      navigate('ConsultScreen', {
        pid: pid,
        type: NotificationType.consultChat,
        title: userName + ' 付费图文咨询', 
        id: existedConsult?.consultId,
      });
    } else if (type === NotificationType.consultPhone) {
      // 付费电话咨询，到说明页面
      navigate('ConsultPhoneScreen', {
        pid: pid,
        type: NotificationType.consultPhone,
        title: userName + ' 付费电话咨询', 
        id: id || existedConsult?.consultId,
      });
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
          dispatch(updateSnackbar('药师标记图文咨询已经完成', MessageType.success))
        }
        closeMenu();
        return;

      default:
        return;
    }

    dispatch(updateSnackbar('药师标记消息已处理！', MessageType.success))
    closeMenu();
  }

  const consultReject = () => {
    closeMenu();
    onConsultReject();
  }


  return (
    <>
      {visible && (
        <View style={{ position: 'absolute', right: 10, top: Platform.OS === 'ios' ? insets.top : (insets.top + 2) }}>
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
                visible={menuOpen}
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
                {!fromConsultPhone ? (
                  <Menu.Item icon="check-circle" onPress={markDone} title="标识完成" />
                ) : (
                    <Menu.Item icon="keyboard-backspace" onPress={() => goBackConsult(true, id)} title="付费电话咨询" />
                  )}
                {(type === NotificationType.consultChat) && (
                  <>
                    <Divider />
                    <Menu.Item icon="keyboard-backspace" onPress={consultReject} title="咨询拒绝" />
                  </>
                )}
                <View style={{
                  display: (type === NotificationType.chat && existedConsult && existedConsult.exists) ? 'flex' : 'none'
                }}>
                  <Divider />
                  <Menu.Item icon="keyboard-backspace" onPress={() => goBackConsult(false, id)} title="返回付费咨询" />
                </View>
              </Menu>
            </View>
          </Provider>
        </View>
      )}
    </>
  );
}
