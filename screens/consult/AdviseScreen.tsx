import * as React from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, useWindowDimensions } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { Button, CheckBox, Divider, Icon, ListItem, SearchBar } from 'react-native-elements';
import { View } from '../../components/Themed';
import { Dialog, Searchbar, TextInput } from 'react-native-paper';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { getAdviseTemplatesByDepartmentId } from '../../services/hospital.service';
import { finalize, map, tap } from 'rxjs/operators';
import { getAuthState } from '../../services/core/auth';
import { AdviseTemplate, Question } from '../../models/survey/advise-template.model';
import SurveyQuestions from '../../components/SurveyQuestions';
import { searchByCriteria } from '../../services/user.service';
import { User } from '../../models/crm/user.model';
import Spinner from '../../components/shared/Spinner';

export default function AdviseScreen() {
  const [patientSelect, setPatientSelect] = useState('')
  const [searchPatientVisible, setSearchPatientVisible] = useState(false)
  const [searchType, setSearchType] = useState('name')
  const [searchQuery, setSearchQuery] = useState('')
  const initSearchResults: User[] = [];
  const [searchResults, setSearchResults] = useState(initSearchResults)
  const [searching, setSearching] = useState(false)

  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')
  const [cell, setCell] = useState('')
  const [count, setCount] = useState(0)

  const initQuestions: Question[] = []
  const [questions, setQuestions] = useState(initQuestions)

  const initAdviseTemplates: AdviseTemplate[] = [];
  const [adviseTemplates, setAdviseTemplates] = useState(initAdviseTemplates);
  const dimensions = useWindowDimensions();

  useEffect(() => {
    getAuthState().then(_ => {
      if (_.doctor?.department?._id) {
        getAdviseTemplatesByDepartmentId(_.doctor.department._id).pipe(
          map(results => {
            setAdviseTemplates(results);
          })
        ).subscribe();
      }
    }).catch(err => {
    })
    return () => {
    }
  }, [])

  const buildSelectItems = () => {
    const selectItems: Item[] = [];
    adviseTemplates.map(_ => {
      selectItems.push({ label: _.name || '', value: _._id })
      return _;
    });
    return selectItems;
  }

  const loadDataByAdviseTemplateId = (id: string) => {
    if (!adviseTemplates?.length) return;
    const adviseTemplate = adviseTemplates.find(_ => _._id === id);
    setQuestions(adviseTemplate?.questions || []);
  }

  const selectTempPatient = () => {
    setPatientSelect('temp')
  }

  const openPatientSearch = () => {
    setSearchPatientVisible(true);
  }

  const selectPatient = (p: User) => {
    // 搜索注册用户
    setPatientSelect('user')
  }

  const cancelSelectPatient = () => {
    setPatientSelect('');
    setSearchPatientVisible(false);

    setSearchType('name')
    setSearchQuery('');
    setSearchResults([])
  }

  const onChangeSearch = (query: string) => setSearchQuery(query);
  const searchPatients = () => {
    if (searchType) {
      console.log('type: ', searchType);
      setSearching(true);
      searchByCriteria(searchType, searchQuery).pipe(
        tap(results => {
          console.log('===>', results.length);

          setSearchResults(results);
          // trigger render
          const _count = count + 1;
          setCount(_count)
        }),
        finalize(() => {
          setSearching(false);
        })
      ).subscribe();
    }
  }
  const handleKeypress = (e: any) => {
    console.log(e.nativeEvent);

    //it triggers by pressing the enter key
    if (e.nativeEvent.keyCode === 13) {
      searchPatients();
    }

  }


  const onQuestionsChange = useCallback((_questions: Question[]) => {
    console.log(_questions);

    setQuestions(_questions)
    // trigger render
    const _count = count + 1;
    setCount(_count)

  }, [count]);

  return (
    <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={100} style={styles.container}>
      <ScrollView>
        <View style={styles.patientOptions}>
          <Button title=" 新建临时病患" type={patientSelect === 'temp' ? 'solid' : 'outline'} buttonStyle={styles.button} onPress={selectTempPatient}
            icon={<Icon name={patientSelect === 'temp' ? 'check-circle' : ''} size={18} color="white" />} />
          <Button title=" 选择注册病患" type={patientSelect === 'user' ? 'solid' : 'outline'} buttonStyle={styles.button} titleStyle={{ paddingLeft: 8 }}
            icon={<Icon name={patientSelect === 'user' ? 'check-circle' : ''} size={18} color="white" />} onPress={openPatientSearch} />
        </View>
        {!!patientSelect && (

          <View style={{ paddingHorizontal: 16, }}>
            <TextInput
              label="姓名"
              placeholder="请输入..."
              value={name}
              onChangeText={text => setName(text)} error={false}
              style={styles.inputStyle}
            />

            <View style={styles.inlineBlock}>
              <Text style={{ paddingRight: 16, fontSize: 16, color: 'gray' }}>性别</Text>
              <CheckBox
                title='男'
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checked={gender === 'M'}
                onPress={() => setGender('M')}
                containerStyle={styles.checkBoxItem}
              />
              <CheckBox
                title='女'
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checked={gender === 'F'}
                onPress={() => setGender('F')}
                containerStyle={styles.checkBoxItem}
              />
            </View>
            <TextInput
              label="年龄"
              placeholder="请输入..."
              value={age}
              onChangeText={text => setAge(text)} error={false}
              style={styles.inputStyle}
            />
            <TextInput
              label="手机"
              placeholder="请输入..."
              value={cell}
              onChangeText={text => setCell(text)} error={false}
              style={styles.inputStyle}
            />

            <View style={{ paddingVertical: 16 }}>
              <RNPickerSelect
                placeholder={{
                  label: '请选择线下咨询模板',
                  fontSize: 14,
                  value: 0,
                  color: '#8EA0A4',
                }}
                items={buildSelectItems()}
                onValueChange={(value) => { loadDataByAdviseTemplateId(value) }}
                InputAccessoryView={() => null}
                style={{
                  ...pickerSelectStyles,
                  iconContainer: {
                    top: 14,
                    right: 10,
                  },
                  placeholder: {
                    color: 'gray',
                    fontSize: 16,
                    fontWeight: 'bold',
                  },
                }}
                useNativeAndroidPickerStyle={false}
                Icon={() => {
                  return (
                    <View
                      style={{
                        backgroundColor: 'transparent',
                        borderTopWidth: 10,
                        borderTopColor: 'lightgray',
                        borderRightWidth: 10,
                        borderRightColor: 'transparent',
                        borderLeftWidth: 10,
                        borderLeftColor: 'transparent',
                        width: 0,
                        height: 0,
                      }}
                    />
                  );
                }}
              />
            </View>
            <Divider></Divider><Text>{count}</Text>
            <Text>{questions[0]?.options[0]?.selected}</Text>
            <SurveyQuestions key="load-questions" questions={questions} onChange={onQuestionsChange}></SurveyQuestions>
            <View style={styles.oneLine}>
              <Button title="取消" type="outline" buttonStyle={styles.button} />
              <Button title="确定" buttonStyle={styles.button} />
            </View>
          </View>
        )}

        <Dialog visible={searchPatientVisible}
          style={{ left: 0, right: 0, marginTop: 50 }}>
          <Dialog.Title>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>选择病患 </Text>
                <Text style={{ fontSize: 12, color: 'gray' }}>  请根据选项搜索</Text>
              </View>
              <Icon
                name='ios-close'
                type='ionicon'
                color='#517fa4'
                style={{ width: 20 }}
                onPress={cancelSelectPatient}
              />
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
              style={{}}
              onChangeText={onChangeSearch}
              value={searchQuery}
              onKeyPress={handleKeypress}
              onIconPress={searchPatients}
            />
            {searching && <Spinner />}
            {!searching && (
              <ScrollView style={{ paddingTop: 6, minHeight: 200, maxHeight: dimensions.height - 450 }}>
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
                      <ListItem.Chevron type='ionicon' name="ios-arrow-forward" size={24} color="gray"
                        onPress={() => selectPatient(p)} />
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginHorizontal: 16,
    paddingHorizontal: 8,
    // paddingLeft: 16,
    // paddingRight: 22,
    marginBottom: 8,
  },
  patientOptions: {
    paddingTop: 8,
    marginTop: 12,
    // flexDirection: 'row',
    // justifyContent: 'space-between'
  },
  inlineBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 4,
    borderColor: 'lightgray',
    borderStyle: 'solid',
    borderBottomWidth: 1,
  },
  lineBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  checkBoxItem: {
    backgroundColor: 'white',
    borderColor: 'white',
    width: 60,
  },
  checkBoxSearchItem: {
    backgroundColor: 'white',
    borderColor: 'white',
    paddingHorizontal: 0,
    marginLeft: -12,
  },

  inputStyle: {
    backgroundColor: 'white',
  },
  oneLine: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textHint: {
    paddingHorizontal: 16,
    paddingTop: 8,
    color: 'gray',
    fontSize: 12,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 18,
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
    alignSelf: 'stretch'
  },
  inputAndroid: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 4,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
