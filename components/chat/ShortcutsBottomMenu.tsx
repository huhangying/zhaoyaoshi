import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { BottomSheet, ListItem } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';


export default function ShortcutBottomMenu({ shortcuts, isVisible, onSelect }: { shortcuts?: string, isVisible: boolean, onSelect: any }) {
  const initShortcutList: string[] = [];
  const [shortcutList, setShortcutList] = useState(initShortcutList);

  const cancelMenu = () => {
    onSelect('');
  }
  const selectShortcut = (shortcut: string) => {
    onSelect(shortcut);
  }

  useEffect(() => {
    if (!shortcuts) {
      setShortcutList([]);
    } else {
      setShortcutList(shortcuts.split('|'));
    }
    return () => {
    }
  }, [shortcuts])

  return (
    <BottomSheet modalProps={{}} isVisible={isVisible}>
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
            {shortcutList.map((l, i) => (
              <ListItem key={i} bottomDivider onPress={() => selectShortcut(l)}>
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
