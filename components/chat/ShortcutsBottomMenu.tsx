import React from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheet, ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

export default function ShortcutBottomMenu({ shortcuts, onSelect }: { shortcuts: string, onSelect: any }) {

  const cancelMenu = () => {
    onSelect('');
  }
  const selectShortcut = (shortcut: string) => {
    onSelect(shortcut);
  }

  return (
    <BottomSheet modalProps={{ animationType: 'slide' }} isVisible={true}>
      {!shortcuts ? (
        <ListItem key="title" bottomDivider >
          <ListItem.Content>
            <ListItem.Title>您还没有设置快捷回复，请先到“快捷回复管理”中添加。</ListItem.Title>
          </ListItem.Content>
        </ListItem>
      ) : (
        <>
          <ListItem key="title" containerStyle={{ backgroundColor: '#0095ff' }} bottomDivider >
            <ListItem.Content>
              <ListItem.Title style={{ color: 'white' }}>请选择快捷回复</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          {shortcuts.split('|').map((l, i) => (
            <ListItem key={'shortcut-' + i} bottomDivider onPress={() => selectShortcut(l)}>
              <ListItem.Content>
                <ListItem.Title>{l}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))}
        </>
      )
      }

      <ListItem key="cancel" onPress={cancelMenu}>
        <ListItem.Content>
          <ListItem.Title style={{ color: 'orangered' }}>
            <Ionicons name="ios-close-circle-outline" size={18} color="red" />
            &nbsp;&nbsp;&nbsp;取消
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
});
