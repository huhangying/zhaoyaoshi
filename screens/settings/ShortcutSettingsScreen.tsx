import * as React from 'react';
import { StyleSheet } from 'react-native';
import { useEffect } from 'react';
import { useDispatch, useStore } from 'react-redux';
import EditTextList from '../../components/EditTextList';
import { updateDoctorShortcuts } from '../../services/doctor.service';
import { tap } from 'rxjs/operators';
import { updateDoctor } from '../../services/core/app-store.actions';

export default function ShortcutSettingsScreen() {
  const [shortcuts, setShortcuts] = React.useState([])
  const { doctor } = useStore().getState();
  const dispatch = useDispatch();

  useEffect(() => {
    setShortcuts(doctor.shortcuts.split('|'));
    return () => {
    }
  }, [doctor, doctor.shortcuts]);

  const onListSave = React.useCallback(newList => {
    const newShortcuts = shortcuts.join('|');
    updateDoctorShortcuts(doctor.user_id, newShortcuts).pipe(
      tap(rsp => {
        if (rsp?._id) {
          dispatch(updateDoctor({...doctor, shortcuts: newShortcuts}));
        }
      })
    ).subscribe();
  }, [doctor, shortcuts, dispatch]);

  return (
    <>
      <EditTextList list={shortcuts} onListSave={onListSave} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
});
