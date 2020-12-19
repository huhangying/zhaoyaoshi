import * as React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useEffect, useState } from 'react';
import { Caption } from 'react-native-paper';
import EditTextList from '../../../components/EditTextList';
import { getDoctorConsultByDoctorId, updateDoctorConsult } from '../../../services/consult.service';
import { tap } from 'rxjs/operators';
import { Header } from 'react-native-elements';
import Constants from "expo-constants";

export default function ConsultTags({ doctorid, onClose }: { doctorid: string, onClose: any }) {
  const [tags, setTags] = useState([''])

  useEffect(() => {
    if (doctorid) {
      getDoctorConsultByDoctorId(doctorid).pipe(
        tap(result => {
          if (result) {
            setTags(result.tags?.split('|') || []);
          }
        })
      ).subscribe();
    }
    return () => {
    }
  }, [doctorid]);

  const onListSave = React.useCallback(() => {
    const newTags = tags.join('|');
    if (doctorid) {
      updateDoctorConsult(doctorid, {doctor_id: doctorid, tags: newTags}).pipe(
        tap(rsp => {
          // if (rsp?._id) {
          // }
        })
      ).subscribe();
    }
  }, [doctorid, tags]);

  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: '编辑自定义标签', style: { color: '#fff' } }}
        rightComponent={{ icon: 'close', color: '#fff', onPress: onClose }}
      />
      <Caption style={styles.m3}>自定义标签列表</Caption>
      <EditTextList key="edit-tags" list={tags} onListSave={onListSave} />
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