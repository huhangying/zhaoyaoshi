import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Caption, Switch } from 'react-native-paper';
import * as Notifications from 'expo-notifications';

export default function NotificationsSettingsScreen() {

  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleVibration = () => {
    setIsSwitchOn(!isSwitchOn);
  };

  useEffect(() => {

    return () => {
    };
  }, []);

  return (
    <>
      <Caption style={styles.m3}>消息提醒设置</Caption>
      <ListItem key={1} bottomDivider >
        <ListItem.Content>
          <ListItem.Title>新消息提醒时震动</ListItem.Title>
        </ListItem.Content>
        <Switch value={isSwitchOn} onValueChange={onToggleVibration} />
      </ListItem>
    </>
  );
}

const styles = StyleSheet.create({
  m3: {
    margin: 18,
    marginVertical: 16
  },
});
