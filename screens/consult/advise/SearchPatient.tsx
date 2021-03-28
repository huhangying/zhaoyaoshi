import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { CheckBox, Icon, ListItem } from "react-native-elements";
import { Dialog, Divider, Searchbar } from "react-native-paper";
import { finalize, tap } from "rxjs/operators";
import Spinner from "../../../components/shared/Spinner";
import { User } from "../../../models/crm/user.model";
import { searchByCriteria } from "../../../services/user.service";


export default function SearchPatient({ visible, onSelect }:
  { visible?: boolean, onSelect?: any }) {
  const dimensions = useWindowDimensions();

  const [searchType, setSearchType] = useState('name')
  const [searchQuery, setSearchQuery] = useState('')
  const initSearchResults: User[] = [];
  const [searchResults, setSearchResults] = useState(initSearchResults)
  const [searching, setSearching] = useState(false)

  const [errorMessage, setErrorMessage] = useState('')

  const selectPatient = (p: User) => {
    onSelect(p);
    cleanupSelectPatientDialog();
  }

  const cancelSelectPatient = () => {
    onSelect(null);
    // clean up
    cleanupSelectPatientDialog();
  }

  const cleanupSelectPatientDialog = () => {
    setErrorMessage('')
    setSearchType('name')
    setSearchQuery('');
    setSearchResults([])
  }

  const onChangeSearch = (query: string) => setSearchQuery(query);
  const searchPatients = () => {
    // 至少一个字符
    if (searchQuery.length < 1) {
      setErrorMessage('搜索要求至少输入一个字')
      return;
    }

    setErrorMessage('');
    if (searchType) {
      setSearching(true);
      // 搜索注册用户
      searchByCriteria(searchType, searchQuery).pipe(
        tap(results => {
          // console.log('===>', results.length);
          setSearchResults(results);
        }),
        finalize(() => {
          setSearching(false);
        })
      ).subscribe();
    }
  }

  if (!visible) {
    return <></>;
  } else
    return (<>
      <Dialog visible={true} style={{ left: 0, right: 0 }}>
        <Dialog.Title>
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>选择病患 </Text>
              <Text style={{ fontSize: 12, color: 'gray' }}>  请根据选项搜索</Text>
            </View>
            <Pressable onPress={cancelSelectPatient}>
              <Icon
                name='ios-close'
                type='ionicon'
                color='#517fa4'
                style={{ width: 30, paddingVertical: 2, paddingLeft: 10, paddingRight: 2 }}
              />
            </Pressable>
          </View>
        </Dialog.Title>
        <Divider></Divider>
        <Dialog.Content style={{ backgroundColor: 'white' }}>
          <View style={styles.lineBlock}>
            <CheckBox
              title='姓名'
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={searchType === 'name'}
              onPress={() => setSearchType('name')}
              containerStyle={styles.checkBoxSearchItem}
            />
            <CheckBox
              title='手机'
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={searchType === 'cell'}
              onPress={() => setSearchType('cell')}
              containerStyle={styles.checkBoxSearchItem}
            />
            <CheckBox
              title='病患备注'
              checkedIcon='dot-circle-o'
              uncheckedIcon='circle-o'
              checked={searchType === 'notes'}
              onPress={() => setSearchType('notes')}
              containerStyle={styles.checkBoxSearchItem}
            />
          </View>
          <Searchbar
            placeholder="请输入搜索"
            onChangeText={onChangeSearch}
            value={searchQuery}
            onEndEditing={searchPatients}
          />
          <>
            {!!errorMessage && (
              <Text style={{ paddingHorizontal: 16, paddingVertical: 8, color: 'orangered' }}>{errorMessage}</Text>
            )}
          </>

          {searching && <Spinner />}
          {!searching && (
            <ScrollView style={{ paddingTop: 6, minHeight: 200, maxHeight: dimensions.height - 420 }}>
              {
                searchResults?.map((p, i) => (
                  <ListItem key={`search-result-${i}`} bottomDivider>
                    <ListItem.Content>
                      <ListItem.Title>{p.name}</ListItem.Title>
                      <ListItem.Subtitle style={styles.textHint}>
                        {p.cell ? ` 手机：${p.cell}` : ''}
                        {p.notes ? ` 备注：${p.notes}` : ''}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                    <Pressable onPress={() => selectPatient(p)}>
                      <ListItem.Chevron type='ionicon' name="ios-arrow-forward" size={24} color="gray" style={{padding: 4}} />
                    </Pressable>
                  </ListItem>
                ))
              }
              {!searchResults?.length &&
                <Text style={{ padding: 16, marginTop: 24, backgroundColor: 'lightyellow' }}>没有搜索结果</Text>
              }
            </ScrollView>
          )}
        </Dialog.Content>
      </Dialog>
    </>);
}


const styles = StyleSheet.create({
  lineBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  checkBoxSearchItem: {
    backgroundColor: 'white',
    borderColor: 'white',
    paddingHorizontal: 0,
    marginLeft: -12,
  },
  textHint: {
    paddingHorizontal: 16,
    paddingTop: 8,
    color: 'gray',
    fontSize: 12,
  },
});
