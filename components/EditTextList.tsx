import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Button, Dialog, Divider, FAB, Paragraph, TextInput } from 'react-native-paper';

export default function EditTextList({ list, onListSave }: { list: string[], onListSave: any }) {
  const [action, setAction] = React.useState('');
  const [selectItem, setSelectItem] = React.useState('');
  const [selectIndex, setSelectIndex] = React.useState(-1);
  const [visible, setVisible] = React.useState(false);

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
      <ScrollView>
        {
          list.map((l, i) => (
            <ListItem key={i} bottomDivider containerStyle={i === selectIndex ? styles.highlight : styles.normal}>
              <ListItem.Content>
                <ListItem.Title>{l}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron type='ionicon' name="ios-create" size={30} color="green" style={styles.mr2} onPress={() => openSelect(l, i)} />
              <ListItem.Chevron type='ionicon' name="ios-trash" size={30} color="red" style={styles.mr2} onPress={() => deleteConfirm(l, i)} />
            </ListItem>
          ))
        }
      </ScrollView>

      <Dialog visible={visible}>
        <Dialog.Title>{action === 'delete' ? '确认删除' :
          (action === 'add' ? '新增' : '编辑')}</Dialog.Title>
        <Divider></Divider>
        <Dialog.Content style={styles.pt3}>
          {action === 'delete' ?
            <Paragraph>您确定要删除该数据吗？</Paragraph> :
            <TextInput
              value={selectItem}
              onChangeText={text => setSelectItem(text)}
            />
          }
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="outlined" style={[styles.mr3, styles.px3]} onPress={() => resetSelect()}>
            取消</Button>
          <Button mode="contained" style={[styles.mr2, styles.px3]} disabled={!selectItem} onPress={() => saveItem()}>
            确定</Button>
        </Dialog.Actions>
      </Dialog>
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => openSelect('')}
      />
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  }
});
