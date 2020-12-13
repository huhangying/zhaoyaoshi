import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { User } from '../models/crm/user.model';
import { Text, View } from './Themed';
import { Button, Dialog, Divider } from 'react-native-paper';
import { wxImgPath } from '../services/core/image.service';
import { ListItem } from 'react-native-elements';
import Spinner from './shared/Spinner';
import { getDateFormat } from '../services/core/moment';

export default function PatientDetails({ user, onClose }: { user: User, onClose: any }) {


  useEffect(() => {
    return () => {
    }
  }, [user])

  if (!user?._id) {
    return (<Spinner />);
  } else {
    return (
      <Dialog visible={true} onDismiss={onClose}>
        <Dialog.Title >
          <ListItem
            style={styles.header}
            leftAvatar={{
              size: "medium",
              source: { uri: wxImgPath(user.icon) },
            }}
            title={user.name}
          />
          {/* <Avatar
            rounded size="medium"
            source={{ uri: wxImgPath(user.icon) }} />
          <Text style={{alignSelf: 'center', height: 58, marginBottom: 12}}> {'  ' + user.name}</Text> */}
        </Dialog.Title>
        <Divider></Divider>
        <Dialog.Content style={styles.content}>
          <ScrollView>
            <Text style={styles.item}>状态： {user.role === 1 ? '审核通过' : '未审核'}</Text>
            <Divider></Divider>
            <Text style={styles.item}>性别： {user.gender === 'M' ? '男' : (user.gender === 'F' ? '女' : '')}</Text>
            <Divider></Divider>
            <Text style={styles.item}>生日：{getDateFormat(user.birthdate)}</Text>
            <Divider></Divider>
            <Text style={styles.item}>手机：{user.cell}</Text>
            <Divider></Divider>
            <Text style={styles.item}>疾病诊断：{user.diagnoses?.replace(/[|]/g, ', ')}</Text>
            <Divider></Divider>
            <Text style={styles.item}>诊断提醒：{user.prompt?.replace(/[|]/g, ', ')}</Text>
            <Divider></Divider>
            <Text style={styles.item}>病患备注：{user.notes?.replace(/[|]/g, ', ')}</Text>
            <Divider></Divider>
          </ScrollView>
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
  header: {
    padding: 0,
    marginTop: 0,
    marginHorizontal: 0,
    height: 56,
  },
  content: {
    marginTop: 16,
  },
  item: {
    paddingVertical: 10,
  }
});
