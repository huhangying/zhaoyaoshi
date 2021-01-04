import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useCallback, useEffect } from 'react';
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
    const newShortcuts = shortcuts.join('|');
    if (doctor) {
      updateDoctorShortcuts(doctor.user_id, newShortcuts).pipe(
        tap(rsp => {
          if (rsp?._id) {
            dispatch(updateDoctor({ ...doctor, shortcuts: newShortcuts }));
          }
        })
      ).subscribe();
    }
  }, [doctor, shortcuts, dispatch]);

  return (
    <View style={styles.container}>
      <Caption style={styles.m3}>快捷回复列表</Caption>
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
  m3: {
    margin: 16,
    marginVertical: 16,
  },
});
