import * as React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Text } from '../../components/Themed';
import { getDoctorGroups, getPatientGroupedRelationships } from '../../services/doctor.service';
import { GroupedRelationship, Relationship } from '../../models/crm/relationship.model';
import { tap } from 'rxjs/operators';
import { AppState } from '../../models/app-state.model';
import { List } from 'react-native-paper';
import { DoctorGroup } from '../../models/crm/doctor-group.model';
import { User } from '../../models/crm/user.model';
import PatientDetails from '../../components/PatientDetails';

export default function RelationshipScreen() {
  const doctor = useSelector((state: AppState) => state.doctor);
  // const initGroupedRelationship: GroupedRelationship[] = []; //{ user: { _id: '' }, relationships: [] };
  const [groupedRelationships, setGroupedRelationships] = useState([]);
  const initDoctorGroup: DoctorGroup = { _id: '', name: '' };
  const [doctorGroups, setDoctorGroups] = useState([initDoctorGroup]);
  const scrollViewRef = useRef();
  const initRrelationshipList: Relationship[] = [];
  const [relationshipList, setRrelationshipList] = useState(initRrelationshipList)

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

  const [user, setUser] = useState({ _id: '' })
  const [visible, setVisible] = React.useState(false);
  const closePatientDetails = () => setVisible(false);
  const openPatientDetails = (user?: User) => {
    if (user?._id) {
      setUser(user);
      setVisible(true);
    }
  }

  const [expandId, setExpandId] = React.useState(-1);
  const handlePress = (i: number, group: DoctorGroup) => {
    if (expandId !== i) {
      setExpandId(i);
    } else {
      setExpandId(-1);
    }
    setRrelationshipList(loadData(group._id));
    scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
  }

  return (
    <>
      <Text style={styles.m3}>用户群组</Text>
      <ScrollView ref={scrollViewRef}>
        {doctorGroups.map((group: DoctorGroup, i) => (
          <List.Accordion
            style={styles.group}
            left={props => <List.Icon {...props} icon="account-group" color="azure" />}
            title={group.name}
            id={i} key={i}
            expanded={i === expandId}
            onPress={() => handlePress(i, group)}>

            {relationshipList?.length ? (
              relationshipList.map((relationship: Relationship, k) => (
                <TouchableOpacity key={`${i}-${k}`} onPress={() => openPatientDetails(relationship.user)} style={styles.item}>
                  <List.Item
                    title={relationship.user?.name} />
                </TouchableOpacity>
              ))
            ) : (
                <Text style={{backgroundColor: 'lightyellow', paddingTop: 14, paddingBottom: 16, color: 'gray' }}>没有数据</Text>
              )
            }
          </List.Accordion>
        ))
        }
      </ScrollView>


      {!!visible &&
        <PatientDetails user={user} onClose={closePatientDetails} />
      }
    </>
  );
}

const styles = StyleSheet.create({
  m3: {
    margin: 16,
    marginVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  group: {
    backgroundColor: 'lightskyblue',
    marginVertical: 1,
    paddingVertical: 0,
    marginHorizontal: 6,
  },
  item: {
    backgroundColor: 'ivory',
    marginBottom: 1,
  }
});
