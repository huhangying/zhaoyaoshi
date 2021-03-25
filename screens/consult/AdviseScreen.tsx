import * as React from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { Button, CheckBox, Divider, Icon } from 'react-native-elements';
import { View } from '../../components/Themed';
import { TextInput } from 'react-native-paper';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { getAdviseTemplatesByDepartmentId } from '../../services/hospital.service';
import { map } from 'rxjs/operators';
import { getAuthState } from '../../services/core/auth';
import { AdviseTemplate, Question } from '../../models/survey/advise-template.model';
import SurveyQuestions from '../../components/SurveyQuestions';

export default function AdviseScreen() {
  const [patientSelect, setPatientSelect] = useState('')
  const [name, setName] = useState('')
  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')
  const [cell, setCell] = useState('')
  const initQuestions: Question[] = []
  const [questions, setQuestions] = useState(initQuestions)

  const initAdviseTemplates: AdviseTemplate[] = [];
  const [adviseTemplates, setAdviseTemplates] = useState(initAdviseTemplates);

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

  const selectPatient = () => {
    setPatientSelect('user')
  }

  const onQuestionsChange = useCallback((_questions: Question[]) => {
    console.log(_questions);

    setQuestions(_questions)

  }, []);

  return (
    <KeyboardAvoidingView behavior="height" keyboardVerticalOffset={100} style={styles.container}>
      <ScrollView>
        <View style={styles.content}>
          <Button title=" 新建临时病患" type={patientSelect === 'temp' ? 'solid' : 'outline'} buttonStyle={styles.button} onPress={selectTempPatient}
            icon={<Icon name={patientSelect === 'temp' ? 'check-circle' : ''} size={18} color="white" />} />
          <Button title=" 选择注册病患" type={patientSelect === 'user' ? 'solid' : 'outline'} buttonStyle={styles.button} titleStyle={{ paddingLeft: 8 }}
            icon={<Icon name={patientSelect === 'user' ? 'check-circle' : ''} size={18} color="white" />} onPress={selectPatient} />
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
            <Divider></Divider>
            <SurveyQuestions key="load-questions" questions={questions} onChange={onQuestionsChange}></SurveyQuestions>
          </View>
        )}
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
    paddingLeft: 16,
    paddingRight: 22,
    marginBottom: 8,
  },
  content: {
    paddingTop: 8
  },
  inlineBlock: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingBottom: 4,
    borderColor: 'lightgray',
    borderStyle: 'solid',
    borderBottomWidth: 1,
  },
  checkBoxItem: {
    backgroundColor: 'white',
    borderColor: 'white',
    width: 60,
  },
  inputStyle: {
    backgroundColor: 'white',
  },
  note: {
    paddingTop: 10,
    color: 'gray',
    fontSize: 13,
  }
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
