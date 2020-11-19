import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, ListItem } from 'react-native-elements';
import { Button, Card, Divider } from 'react-native-paper';
import { Notification, NotificationType } from '../models/io/notification.model';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';

export default function NotificationList({ list, title, onClose }: { list: Notification[], title: string, onClose: any }) {

  return (
    <Card style={styles.container}>
      <Card.Title title={title}
        left={() => <Ionicons name="ios-notifications-outline" size={24} color="gray" />}
      />
      <Divider></Divider>
      <Card.Content>
        <ScrollView>
          {
            list.map((noti, i) => (
              <ListItem key={i} bottomDivider>
                <ListItem.Content>
                  <ListItem.Title>{noti.name}发送了 {noti.count} 条新消息</ListItem.Title>
                  <ListItem.Content>
                    <Text style={[styles.textHint, styles.px3]}>发送于{moment(noti.created).format('YYYY年MM月DD日')}</Text>
                  </ListItem.Content>
                </ListItem.Content>
                <ListItem.Chevron type='ionicon' name="ios-arrow-forward" size={24} color="gray" />
              </ListItem>
            ))
          }
        </ScrollView>
      </Card.Content>
      <Card.Actions>
        <Button mode="outlined" style={{ flex: 1 }} onPress={() => onClose()}>
          取消</Button>
      </Card.Actions>
    </Card>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    marginTop: 26
  },
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
  }
});
