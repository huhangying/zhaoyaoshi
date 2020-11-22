import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { User } from '../models/crm/user.model';
import { Text, View } from './Themed';
import { Button, Dialog, Divider } from 'react-native-paper';

export default function PatientDetails({ user, onClose }: { user: User, onClose: any }) {

  if (!user?._id) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <Dialog visible={true} onDismiss={onClose}>
        <Dialog.Title>{user.name}</Dialog.Title>
        <Divider></Divider>
        <Dialog.Content style={styles.m3}>
          <Text>性别： {user.gender}</Text>
          <Divider></Divider>
          <Text>生日：{user.birthdate}</Text>
          <Divider></Divider>
          <Text>手机：{user.cell}</Text>
          <Divider></Divider>
          <Text>疾病诊断：{user.diagnoses?.replace(/[|]/g, ', ')}</Text>
          <Divider></Divider>
          <Text>诊断提醒：{user.prompt?.replace(/[|]/g, ', ')}</Text>
          <Divider></Divider>
          <View>
            <Text>病患备注：{user.notes?.replace(/[|]/g, ', ')}</Text>
            <Divider></Divider>
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="outlined" style={{ flex: 1 }} onPress={onClose}>
            关闭</Button>
        </Dialog.Actions>
      </Dialog>
    )
  }
}


const styles = StyleSheet.create({
  mr1: {
    marginRight: 4
  },
  mr2: {
    marginRight: 8
  },
  mx2: {
    margin: 8
  },
  mr3: {
    marginRight: 16
  },
  px3: {
    paddingHorizontal: 16
  },
  pt3: {
    paddingTop: 16
  },
  highlight: {
    backgroundColor: '#ffeeba',
  },
  normal: {
  },
  textHint: {
    color: 'gray',
    fontSize: 12
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  m3: {
    margin: 16,
    marginVertical: 16,
  },
});
