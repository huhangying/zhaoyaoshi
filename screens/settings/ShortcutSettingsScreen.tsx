import * as React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditTextList from '../../components/EditTextList';
import { updateDoctorShortcuts } from '../../services/doctor.service';
import { tap } from 'rxjs/operators';
import { updateDoctor } from '../../services/core/app-store.actions';
import { Caption } from 'react-native-paper';
import { AppState } from '../../models/app-state.model';
import Constants from "expo-constants";
import { useNavigation } from '@react-navigation/native';

export default function ShortcutSettingsScreen() {
  const [shortcuts, setShortcuts] = React.useState([''])
  const doctor = useSelector((state: AppState) => state.doctor);
  const dispatch = useDispatch();
  const { goBack } = useNavigation();

  useEffect(() => {
    if (doctor?.shortcuts) {
      setShortcuts(doctor.shortcuts.split('|'));
    }
    return () => {
    }
  }, [doctor?.shortcuts]);

  const onListSave = React.useCallback(newList => {
    const newShortcuts = newList.join('|');
    if (doctor) {
      updateDoctorShortcuts(doctor.user_id, newShortcuts).pipe(
        tap(rsp => {
          if (rsp?._id) {
            dispatch(updateDoctor({ ...doctor, shortcuts: newShortcuts }));
          }
          setShortcuts(newList);
        })
      ).subscribe();
    }
  }, [doctor, dispatch]);

  return (
    <View style={styles.container}>
      <Caption style={styles.caption}>快捷回复列表</Caption>
      <Text style={styles.textHint}>如果后台或药师端修改了快捷回复设置，请登出后重新登录更新信息。</Text>

      <EditTextList key="edit-shortcuts" list={shortcuts} onListSave={onListSave} onModalClose={goBack} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -Constants.statusBarHeight,
    backgroundColor: 'whitesmoke',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  caption: {
    margin: 16,
    marginVertical: 16,
    color: 'black',
    fontSize: 14,
  },
  textHint: {
    fontSize: 12,
    color: 'gray',
    fontStyle: 'italic',
    paddingHorizontal: 16,
    paddingBottom: 16,
  }
});
