import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Button, Divider, Icon } from 'react-native-elements';
import { Dialog, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { MessageType } from '../models/app-settings.model';
import { Consult } from '../models/consult/consult.model';
import { Doctor } from '../models/crm/doctor.model';
import { updateSnackbar } from '../services/core/app-store.actions';
import { generateTranslationId, refundWxPay, sendWechatMsg } from '../services/weixin.service';

export default function ConsultReject({ visible, type, consult, doctor, openid, onModalClose }:
  { visible: boolean, type: number, consult: Consult, doctor: Doctor, openid: string, onModalClose?: any }) {

  const [rejectReason, setRejectReason] = useState('')
  const dispatch = useDispatch()

  const onReject = () => {
    if (!consult?.out_trade_no) {
      dispatch(updateSnackbar('缺少有效的付款交易号，申请退款失败！', MessageType.error));
      closeModel();
      return;
    }
    
    // wx refund
    const refundId = generateTranslationId(type);
    refundWxPay({
      out_trade_no: consult.out_trade_no,
      out_refund_no: refundId,
      total_fee: consult.total_fee || 0,
      refund_fee: consult.total_fee || 0,
    }).pipe(
      tap((rsp) => {
        if (rsp) {
          dispatch(updateSnackbar('申请退款成功！', MessageType.success));
          // 发送药师拒绝消息
          sendWechatMsg(openid,
            `${doctor.name}${doctor.title}未完成本次咨询服务`,
            `原因: ${rejectReason}
咨询服务费：已退款。`,
            `${doctor.wechatUrl}consult-reply?doctorid=${doctor._id}&openid=${openid}&state=${doctor.hid}&id=${consult._id}&reject=true`,
            '',
            doctor._id,
            consult.userName || ''
          ).subscribe();

          dispatch(updateSnackbar('药师付费咨询已经完成！', MessageType.success));
          closeModel();
        } else {
          dispatch(updateSnackbar('申请退款失败！', MessageType.error));
        }
      }),
      catchError(err => {
        dispatch(updateSnackbar('不能执行退款，请联系系统管理员！', MessageType.error));
        return EMPTY;
      })
    ).subscribe();
  }
  
  const closeModel = () => {
    setRejectReason('');
    onModalClose();
  }

  return (
    <Dialog visible={visible}>
      <Dialog.Title>药师拒绝付费咨询服务</Dialog.Title>
      <Divider></Divider>
      <Dialog.Content style={styles.content}>
        <Text style={{ paddingBottom: 6 }}>
          您将拒绝来自{consult.userName}的付费{type === 6 ? '电话咨询' : '图文咨询'}。
        </Text>
        <Text>
          同时将退还咨询费用 {(consult.total_fee || 0) / 100} 元。
        </Text>
        <Text> </Text>
        <TextInput
          label="填写拒绝原因"
          value={rejectReason}
          onChangeText={text => setRejectReason(text)}
        />

        <Text style={styles.note}>
          * 系统将把病患预交的咨询费用退还，并把您填写的拒绝原因已微信消息的形式发送给病患。
        </Text>
      </Dialog.Content>

      <Dialog.Actions style={{ marginTop: -10 }}>
        <Button title="取消" type="outline" buttonStyle={styles.button} onPress={closeModel}
          icon={{ type: 'ionicon', name: 'ios-close-circle-outline', color: '#2f95dc' }} />
        <Button title="发送" disabled={!rejectReason} buttonStyle={styles.button} titleStyle={{ paddingLeft: 8 }}
          icon={<Icon name="check-circle" size={18} color="white" />} onPress={onReject} />
      </Dialog.Actions>
    </Dialog>
  );
}


const styles = StyleSheet.create({
  button: {
    marginHorizontal: 16,
    paddingLeft: 16,
    paddingRight: 22,
    marginBottom: 8,
  },
  content: {
    paddingTop: 16
  },
  note: {
    paddingTop: 10,
    color: 'gray',
    fontSize: 13,
  }
});
