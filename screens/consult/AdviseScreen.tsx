import * as React from 'react';
import { KeyboardAvoidingView, ScrollView, StyleSheet, Text } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, CheckBox, Divider, Icon } from 'react-native-elements';
import { View } from '../../components/Themed';
import { TextInput } from 'react-native-paper';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import { createAdvise, getAdviseTemplatesByDepartmentId } from '../../services/hospital.service';
import { catchError, map, tap } from 'rxjs/operators';
import { getAuthState } from '../../services/core/auth';
import { AdviseTemplate, Question } from '../../models/survey/advise-template.model';
import SurveyQuestions from './advise/SurveyQuestions';
import { User } from '../../models/crm/user.model';
import SearchPatient from './advise/SearchPatient';
import PatientDetails from '../../components/PatientDetails';
import { Advise } from '../../models/survey/advise.model';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../models/app-state.model';
import moment from 'moment';
import { updateSnackbar } from '../../services/core/app-store.actions';
import { MessageType } from '../../models/app-settings.model';

export default function AdviseScreen() {
  const doctor = useSelector((state: AppState) => state.doctor);
  const dispatch = useDispatch()
  const [patientSelect, setPatientSelect] = useState('') // flag 
  const initSelectedPatient: User = { _id: '' };
  const [selectedPatient, setSelectedPatient] = useState(initSelectedPatient)
  const [searchPatientVisible, setSearchPatientVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  const [name, setName] = useState('')
  const [nameFieldError, setNameFieldError] = useState(false)
  const [adviseTemplateFieldError, setAdviseTemplateFieldError] = useState(false)
  const nameInputRef = useRef(null);
  const [gender, setGender] = useState('')
  const [age, setAge] = useState('')
  const [cell, setCell] = useState('')
  const [count, setCount] = useState(0)

  const [adviseTemplateId, setAdviseTemplateId] = useState('')
  const initAdviseTemplates: AdviseTemplate[] = [];
  const [adviseTemplates, setAdviseTemplates] = useState(initAdviseTemplates);

  const initQuestions: Question[] = []
  const [questions, setQuestions] = useState(initQuestions)

  const [sendWxMessage, setSendWxMessage] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [isPerformance, setIsPerformance] = useState(false)

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
  }, [selectedPatient])

  const buildSelectItems = () => {
    const selectItems: Item[] = [];
    adviseTemplates.map(_ => {
      selectItems.push({ label: _.name || '', value: _._id })
      return _;
    });
    return selectItems;
  }

  const loadDataByAdviseTemplateId = (id: string) => {
    setAdviseTemplateId(id);
    if (!id) {
      setAdviseTemplateFieldError(true)
      setQuestions([])
      return;
    }

    setAdviseTemplateFieldError(false);
    if (!adviseTemplates?.length) return;

    const adviseTemplate = adviseTemplates.find(_ => _._id === id);
    setQuestions(adviseTemplate?.questions || []);
  }

  const selectTempPatient = () => {
    cleanupAdvise()
    setPatientSelect('temp')
  }

  const openPatientSearch = () => {
    setSearchPatientVisible(true);
  }

  const onQuestionsChange = useCallback((_questions: Question[]) => {
    console.log(_questions);

    setQuestions(_questions)
    // trigger render
    const _count = count + 1;
    setCount(_count)

  }, [count]);

  const onPatientSelected = useCallback((patient: User) => {
    if (patient) {
      setPatientSelect('user')
      setSelectedPatient(patient);
      // populate 
      setName(patient.name || '')
      setGender(patient.gender || '')
      setAge(patient.birthdate ? moment().diff(patient.birthdate, 'years').toString() : '')
      setCell(patient.cell || '')
    }
    setSearchPatientVisible(false);
    // trigger render
    const _count = count + 1;
    setCount(_count)

  }, [count]);

  const closeDetailsDialog = () => {
    setShowDetails(false)
  }

  const onNameBlur = (text: string, focusOn?: boolean) => {
    if (text) {
      setNameFieldError(false)
      return;
    }
    setNameFieldError(true);
    if (focusOn) {
      nameInputRef.current.focus();
    }
  }

  const cleanupAdvise = () => {
    setPatientSelect('');
    setName('')
    setAge('')
    setGender('')
    setCell('')
    setSelectedPatient(initSelectedPatient)

    setAdviseTemplates(initAdviseTemplates)
    setQuestions(initQuestions)

    setNameFieldError(false)
    setAdviseTemplateFieldError(false)

    setSendWxMessage(false)
    setIsOpen(false)
    setIsPerformance(false)
  }

  const saveAdvise = () => {
    // validation!
    if (!name) {
      onNameBlur(name, true);
      return;
    }
    if (!adviseTemplateId) {
      setAdviseTemplateFieldError(true);
      return;
    }

    const advise: Advise = {
      doctor: doctor?._id || '',
      doctorName: doctor?.name,
      doctorTitle: doctor?.title,
      doctorDepartment: doctor?.department?.name,

      user: selectedPatient?._id,
      name,
      gender,
      age: +age,
      cell,

      adviseTemplate: adviseTemplateId,
      questions,
      isPerformance,
      finished: true
    }
    if (selectedPatient?._id) {
      advise.sendWxMessage = sendWxMessage;
      advise.isOpen = isOpen;
    }

    // submit
    createAdvise(advise).pipe(
      tap(result => {
        if (result?._id) {
          dispatch(updateSnackbar('成功完成线下咨询！', MessageType.success));
          // reset page
          cleanupAdvise();
        } else {
          dispatch(updateSnackbar('结束线下咨询失败。请再试或联系管理员。', MessageType.error));
        }
      }),
      catchError(err => {
        dispatch(updateSnackbar('结束线下咨询失败。请再试或联系管理员。', MessageType.error));
      })
    ).subscribe();
    console.log(advise);

  }


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
          <View style={{ paddingHorizontal: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <TextInput
                label="姓名 *"
                placeholder="请输入..."
                value={name}
                defaultValue={selectedPatient?.name}
                onChangeText={text => setName(text)}
                style={styles.inputStyle}
                ref={nameInputRef}
                onBlur={(event: any) => onNameBlur(event.nativeEvent.text)}
                error={nameFieldError}
              />
              {patientSelect === 'user' && (
                <Button type="outline"
                  title="个人信息"
                  icon={<Icon name="person-outline" size={20} color="royalblue" />}
                  onPress={() => setShowDetails(true)}
                />
              )}
            </View>
            {nameFieldError && <Text style={styles.errorMessage}>姓名为必选</Text>}

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
              keyboardType="numeric"
              value={age}
              onChangeText={text => setAge(text)} error={false}
              style={styles.inputStyle}
            />
            <TextInput
              label="手机"
              placeholder="请输入..."
              keyboardType="phone-pad"
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
                    color: !adviseTemplateFieldError ? 'gray' : 'crimson',
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
            <Divider style={{ backgroundColor: !adviseTemplateFieldError ? 'gray' : 'red' }} />
            {adviseTemplateFieldError && <Text style={styles.errorMessage}>线下咨询模板为必选</Text>}

            <View style={{ paddingHorizontal: 8, paddingTop: 12, paddingBottom: 32 }}>
              <SurveyQuestions key="load-questions" questions={questions} onChange={onQuestionsChange}></SurveyQuestions>
            </View>

            <Divider></Divider>
            <View style={styles.actionLine}>
              <View style={{ paddingVertical: 8, }}>
                {patientSelect === 'user' && (
                  <>
                    <CheckBox
                      title="发送微信消息 "
                      checkedIcon='check-square'
                      uncheckedIcon='square-o'
                      checked={sendWxMessage}
                      containerStyle={styles.questionCheckbox}
                      onPress={() => setSendWxMessage(!sendWxMessage)}

                    />
                    <CheckBox
                      title="其他药师可见 "
                      checkedIcon='check-square'
                      uncheckedIcon='square-o'
                      checked={isOpen}
                      containerStyle={styles.questionCheckbox}
                      onPress={() => setIsOpen(!isOpen)}
                    />
                  </>
                )}
                <CheckBox
                  title="申报绩效 "
                  checkedIcon='check-square'
                  uncheckedIcon='square-o'
                  checked={isPerformance}
                  containerStyle={styles.questionCheckbox}
                  onPress={() => setIsPerformance(!isPerformance)}
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Button title=" 清空内容" type="outline" buttonStyle={styles.button}
                  style={{ marginVertical: 10 }}
                  icon={<Icon name="check-circle" size={18} color="royalblue" />}
                  onPress={cleanupAdvise} />
                <Button title=" 结束归档" buttonStyle={styles.button}
                  style={{ marginVertical: 10 }}
                  icon={<Icon name="archive" size={18} color="white" />}
                  onPress={saveAdvise} />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <SearchPatient visible={searchPatientVisible} onSelect={onPatientSelected} />
      {showDetails &&
        <PatientDetails user={selectedPatient} onClose={closeDetailsDialog} />
      }
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    marginHorizontal: 16,
    paddingHorizontal: 10,
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
  floatRight: {
    position: 'absolute',
    right: 16,
    top: 10
  },
  errorMessage: {
    paddingHorizontal: 12,
    color: 'crimson',
    paddingTop: 4,
  },
  checkBoxItem: {
    backgroundColor: 'white',
    borderColor: 'white',
    width: 60,
  },
  inputStyle: {
    backgroundColor: 'white',
    flex: 1,
  },
  actionLine: {
    // flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 8,
  },
  questionCheckbox: {
    backgroundColor: 'white',
    borderColor: 'white',
    // flex: 0.5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 0,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 18,
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: 'green',
    paddingRight: 30, // to ensure the text is never behind the icon
    alignSelf: 'stretch'
  },
  inputAndroid: {
    fontSize: 18,
    paddingHorizontal: 10,
    paddingVertical: 4,
    color: 'green',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
