import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Button, ListItem } from 'react-native-elements';
import { Dialog, Divider, FAB, Subheading, TextInput } from 'react-native-paper';
import Constants from "expo-constants";
import Swipeable from 'react-native-gesture-handler/Swipeable';

export default function EditTextList({ list, onListSave, onModalClose }: { list: string[], onListSave: any, onModalClose: any }) {
  const [action, setAction] = useState('');
  const [selectItem, setSelectItem] = useState('');
  const [selectIndex, setSelectIndex] = useState(-1);
  const [visible, setVisible] = useState(false);
  const dimensions = useWindowDimensions();

  const openSelect = (item: string, index = -1) => {
    setAction(index === -1 ? 'add' : 'edit');
    setVisible(true);
    setSelectItem(item);
    setSelectIndex(index);
  }
  const resetSelect = () => {
    setVisible(false);
    setSelectItem('');
    setSelectIndex(-1);
  }
  const deleteConfirm = (item: string, index: number) => {
    setAction('delete');
    setVisible(true);
    setSelectItem(item);
    setSelectIndex(index);
  }
  const saveItem = () => {
    switch (action) {
      case 'add':
        list.push(selectItem);
        break;

      case 'edit':
        list[selectIndex] = selectItem;
        break;

      case 'delete':
        list.splice(selectIndex, 1);
        break;

      default:
        break;
    }
    onListSave(list);
    setVisible(false);
  }

  return (
    <>
      <Swipeable
        renderLeftActions={() => (<Text></Text>)}
        onSwipeableLeftOpen={onModalClose}>
        <ScrollView style={{ height: Platform.OS === 'ios' ? dimensions.height - 160 : dimensions.height - 90 }}>
          {
            list.map((l, i) => (l ? (
              <ListItem key={i} bottomDivider containerStyle={i === selectIndex ? styles.highlight : styles.normal}>
                <ListItem.Content>
                  <ListItem.Title>{l}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron type='ionicon' name="ios-create" size={24} color="royalblue" style={styles.mr2} onPress={() => openSelect(l, i)} />
                <ListItem.Chevron type='ionicon' name="ios-trash" size={24} color="tomato" style={styles.mr2} onPress={() => deleteConfirm(l, i)} />
              </ListItem>
            ) :
              (<Text key="nodata" style={{ paddingHorizontal: 20, paddingBottom: 10, color: 'gray' }}> 请点击 + 增加快捷回复。</Text>)
            ))
          }
        </ScrollView>
      </Swipeable>

      <Dialog visible={visible} style={{ position: 'absolute', top: 100, right: 0, left: 0, marginBottom: 136 }}>
        <Dialog.Title>{action === 'delete' ? '确认删除' :
          (action === 'add' ? '新增' : '编辑')}</Dialog.Title>
        <Divider></Divider>
        <Dialog.Content style={styles.pt3}>
          {action === 'delete' ?
            <Subheading>您确定要删除该数据吗？</Subheading> :
            <TextInput
              value={selectItem}
              onChangeText={text => setSelectItem(text)}
            />
          }
        </Dialog.Content>
        <Dialog.Actions>
          <Button title="取消" type="outline" buttonStyle={styles.button} onPress={resetSelect} />
          <Button title="确定" buttonStyle={styles.button} onPress={saveItem} />
        </Dialog.Actions>
      </Dialog>
      
      <FAB
        style={styles.fab}
        icon="plus"
        color="white"
        onPress={() => openSelect('')}
      />
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -Constants.statusBarHeight,
    backgroundColor: '#fff',
  },
  fab: {
    position: 'absolute',
    margin: 24,
    right: 0,
    bottom: 0,
  },
  mr1: {
    marginRight: 4
  },
  mr2: {
    marginRight: 8
  },
  button: {
    marginHorizontal: 16,
    paddingHorizontal: 24
  },
  pt3: {
    paddingTop: 16
  },
  highlight: {
    backgroundColor: '#ffeeba',
  },
  normal: {
  }
});
