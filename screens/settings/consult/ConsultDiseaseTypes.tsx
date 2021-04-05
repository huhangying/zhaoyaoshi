import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { Caption } from 'react-native-paper';
import EditTextList from '../../../components/EditTextList';
import { getDoctorConsultByDoctorId, updateDoctorConsult } from '../../../services/consult.service';
import { tap } from 'rxjs/operators';
import { Header } from 'react-native-elements';

export default function ConsultDiseaseTypes({ doctorid, onClose }: { doctorid: string, onClose: any }) {
  const [diseaseTypes, setDiseaseTypes] = useState([''])

  useEffect(() => {
    if (doctorid) {
      getDoctorConsultByDoctorId(doctorid).pipe(
        tap(result => {
          if (result) {
            setDiseaseTypes(result.disease_types?.split('|') || []);
          }
        })
      ).subscribe();
    }
    return () => {
    }
  }, [doctorid]);

  const onListSave = useCallback((newList) => {
    const newDiseaseTypes = newList.join('|');
    if (doctorid) {
      updateDoctorConsult(doctorid, {doctor_id: doctorid, disease_types: newDiseaseTypes}).pipe(
        tap(rsp => {
          setDiseaseTypes(newList)
        })
      ).subscribe();
    }
  }, [doctorid]);

  const onModalClose = useCallback(() => {
    onClose();
  }, [onClose]);


  return (
    <View style={styles.container}>
      <Header
        centerComponent={{ text: '编辑疾病类型', style: { color: '#fff' } }}
        rightComponent={{ icon: 'close', color: '#fff', onPress: onClose }}
      />
      <Caption style={styles.m3}>疾病类型列表</Caption>
      <EditTextList key="edit-disease-types" list={diseaseTypes} onListSave={onListSave} onModalClose={onModalClose} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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