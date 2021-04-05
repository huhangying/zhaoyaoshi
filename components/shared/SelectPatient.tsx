import * as React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Text } from '../../components/Themed';
import { getDoctorGroups, getPatientGroupedRelationships } from '../../services/doctor.service';
import { GroupedRelationship, Relationship } from '../../models/crm/relationship.model';
import { tap } from 'rxjs/operators';
import { Caption, List } from 'react-native-paper';
import { DoctorGroup } from '../../models/crm/doctor-group.model';
import { white } from 'react-native-paper/lib/typescript/styles/colors';

export default function SelectPatient({ doctorId, onSelect }: { doctorId?: string, onSelect: any }) {
  const [groupedRelationships, setGroupedRelationships] = useState([]);
  const initDoctorGroup: DoctorGroup = { _id: '', name: '' };
  const [doctorGroups, setDoctorGroups] = useState([initDoctorGroup]);
  const scrollViewRef = useRef<ScrollView>(null);
  const initRrelationshipList: Relationship[] = [];
  const [relationshipList, setRrelationshipList] = useState(initRrelationshipList)

  useEffect(() => {
    if (doctorId) {
      getPatientGroupedRelationships(doctorId).pipe(
        tap(results => setGroupedRelationships(results))
      ).subscribe();

      getDoctorGroups(doctorId).pipe(
        tap(results => setDoctorGroups(results))
      ).subscribe();
    }

    return () => {
    }
  }, [doctorId])

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
      <Caption style={styles.m3}>从用户群组中选择</Caption>
      <ScrollView ref={scrollViewRef}>
        {doctorGroups.map((group: DoctorGroup, i) => (
          <List.Accordion
            style={styles.group}
            left={props => <List.Icon {...props} icon="account-group" color="azure" />}
            title={group.name}
            titleStyle={{color: 'white'}}
            id={i} key={i}
            expanded={i === expandId}
            onPress={() => handlePress(i, group)}>

            {relationshipList?.length ? (
              relationshipList.map((relationship: Relationship, k) => (
                <View key={`${i}-${k}`} style={styles.item}>
                  <List.Item key={`item${i}-${k}`} 
                    title={`${relationship.user?.name} ${relationship.user?.gender === 'M' ? '(男)' : (relationship.user?.gender === 'F' ? '(女)' : '')}`}
                    onPress={() => onSelect(relationship?.user)} />
                </View>
              ))
            ) : (
                <Text style={{ backgroundColor: 'lightyellow', paddingTop: 14, paddingBottom: 16, color: 'gray' }}>没有数据</Text>
              )
            }
          </List.Accordion>
        ))
        }
      </ScrollView>
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
    backgroundColor: 'royalblue',
    marginVertical: 1,
    paddingVertical: 0,
    marginHorizontal: 6,
  },
  item: {
    backgroundColor: 'azure',
    marginBottom: 1,
  }
});
