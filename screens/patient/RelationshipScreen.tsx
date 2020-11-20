import * as React from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Text, View } from '../../components/Themed';
import { getDoctorGroups, getPatientGroupedRelationships } from '../../services/doctor.service';
import { GroupedRelationship, Relationship } from '../../models/crm/relationship.model';
import { tap } from 'rxjs/operators';
import { AppState } from '../../models/app-state.model';
import { Badge, Button, Dialog, Divider, List } from 'react-native-paper';
import { DoctorGroup } from '../../models/crm/doctor-group.model';
import { User } from '../../models/crm/user.model';
import PatientDetails from '../../components/PatientDetails';

export default function RelationshipScreen() {
  const doctor = useSelector((state: AppState) => state.doctor);
  const [groupedRelationships, setGroupedRelationships] = useState([])
  const [doctorGroups, setDoctorGroups] = useState([])
  const [user, setUser] = useState({ _id: '' })

  useEffect(() => {
    if (doctor?._id) {
      getPatientGroupedRelationships(doctor._id).pipe(
        tap(results => setGroupedRelationships(results))
      ).subscribe();

      getDoctorGroups(doctor._id).pipe(
        tap(results => setDoctorGroups(results))
      ).subscribe();
    }

    return () => {
    }
  }, [doctor?._id])

  const loadData = (groupFilter = '*') => {
    let data: Relationship[];
    if (groupFilter === '*') {
      data = [...groupedRelationships];
    } else if (!groupFilter) {
      // 查找未分组的所有病患
      data = [...groupedRelationships].filter((_: GroupedRelationship) => {
        return _.relationships.length && _.relationships.findIndex(r => !r.group) > -1;
      });
    } else {
      // 查找选定组的所有病患
      data = [...groupedRelationships].filter((_: GroupedRelationship) => {
        return _.relationships.findIndex(r => r.group === groupFilter) > -1;
      });
    }
    return data;
  }

  const openPatientDetails = (user?: User) => {
    if (user) {
      console.log(user);
      setUser(user);
      setVisible(true);
    }
  }

  const [visible, setVisible] = React.useState(false);
  const closePatientDetails = () => setVisible(false);

  const [expandId, setExpandId] = React.useState(-1);
  const handlePress = (i: number) => setExpandId(i);

  return (
    <>
      <Text style={styles.m3}>用户群组</Text>
      <ScrollView>
        {doctorGroups.map((group: DoctorGroup, i) => (
          <List.Accordion
            style={styles.group}
            left={props => <List.Icon {...props} icon="account-group" />}
            title={group.name} 
            id={i} key={i}
            expanded={i === expandId}
            onPress={() => handlePress(i)}>

            {loadData(group._id).map((relationship: Relationship, k) => (
              <TouchableOpacity key={`${i}-${k}`} onPress={() => openPatientDetails(relationship.user)} style={styles.item}>
                <List.Item
                  title={relationship.user?.name} />
              </TouchableOpacity>
            ))
            }
          </List.Accordion>
        ))
        }
      </ScrollView>

      {/* <Modal visible={visible} animationType="slide" transparent={true} onDismiss={closePatientDetails}>
          <PatientDetails user={user} onClose={onPatientDetailsClose} />
        </Modal> */}

      <Dialog visible={visible} onDismiss={closePatientDetails}>
        <Dialog.Title>{user.name}</Dialog.Title>
        <Divider></Divider>
        <Dialog.Content style={styles.m3}>
          <PatientDetails user={user} />
        </Dialog.Content>
        <Dialog.Actions>
          <Button mode="outlined" style={styles.actionBar} onPress={closePatientDetails}>
            关闭</Button>
        </Dialog.Actions>
      </Dialog>
    </>
  );
}

const styles = StyleSheet.create({
  m3: {
    margin: 16,
    marginVertical: 16,
  },
  actionBar: {
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginBottom: 16
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  group: {
    backgroundColor: 'paleturquoise',
    marginBottom: 1,
  },
  item: {
    backgroundColor: 'ivory',
    marginBottom: 1,
  }
});
