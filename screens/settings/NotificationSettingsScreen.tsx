import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Caption, Switch } from 'react-native-paper';
import { useDispatch, useStore } from 'react-redux';
import { updateAppSettings } from '../../services/core/app-store.actions';

export default function NotificationsSettingsScreen() {
  const store = useStore();
  const dispatch = useDispatch()
  const [disableNoti, setDisableNoti] = React.useState(false);

  const onToggleDisableNoti = () => {
    const value = !disableNoti;
    dispatch(updateAppSettings({disableNoti: value}))
    setDisableNoti(value);
  };

  useEffect(() => {
    setDisableNoti(store.getState().appSettings?.disableNoti || false);

    return () => {
    };
  }, [store]);

  return (
    <>
      <Caption style={styles.sectionTitle}>消息提醒设置</Caption>
      <ListItem key={1} bottomDivider >
        <ListItem.Content>
          <ListItem.Title style={styles.item}>关闭新消息提醒</ListItem.Title>
        </ListItem.Content>
        <Switch value={disableNoti} onValueChange={onToggleDisableNoti} />
      </ListItem>
    </>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    margin: 18,
    marginVertical: 16,
  },
  item: {
    paddingLeft: 16,
  }
});
