import React, { useEffect } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { User } from '../models/crm/user.model';
import { Text, View } from './Themed';
import { Avatar, Button, Dialog, Divider, List, Title } from 'react-native-paper';
import { wxImgPath } from '../services/core/image.service';
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
          <List.Item
            style={styles.header}
            left={() => (<><Avatar.Image size={52} source={ wxImgPath(user.icon) } /><Title style={styles.headerTitle}>{user.name}</Title></>)}
            title={''}
          />
        </Dialog.Title>
        <Divider></Divider>
        <Dialog.Content style={styles.content}>
          <ScrollView>
            <Text style={styles.item}>状态：
            {user.role === 1 ? <Text style={{ color: 'green' }}>审核通过</Text> : <Text style={{ color: 'red' }}>未审核</Text>}
            </Text>
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
    paddingTop: 10,
    marginTop: 2,
    marginHorizontal: 0,
    height: 56,
  },
  headerTitle: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  content: {
    marginTop: 16,
  },
  item: {
    paddingVertical: 10,
  }
});
