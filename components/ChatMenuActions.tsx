import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Doctor } from '../models/crm/doctor.model';
import { Menu, Provider } from 'react-native-paper';
import { NotificationType } from '../models/io/notification.model';
import { Button, Divider, Icon } from 'react-native-elements';

export default function ChatMenuActions({ pid, type, doctor, id }:
  { pid: string, type: NotificationType, doctor: Doctor, id?: string }) {
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => {
    console.log('Pressed')
    setVisible(true);
  }

  const closeMenu = () => setVisible(false);

  const selectItem = (action: string) => {
    console.log(action);
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

            <Menu.Item icon="check-circle" onPress={() => { selectItem('itme 1') }} title="标识完成" />
            <View style={{
              display: [NotificationType.chat, NotificationType.consultPhone, NotificationType.consultChat].indexOf(type) > -1 ? 'flex' : 'none'
            }}>
              <Divider />
              <Menu.Item icon="keyboard-backspace" onPress={() => { selectItem('itme 3') }} title="返回付费咨询" />
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
