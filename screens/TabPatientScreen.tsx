import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Caption } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Spinner from '../components/shared/Spinner';
import { Text, View } from '../components/Themed';
import { AppState } from '../models/app-state.model';
import { getUserCountByDoctorId } from '../services/user.service';

export default function TabPatientScreen() {
  const { navigate } = useNavigation();
  const doctor = useSelector((state: AppState) => state.doctor);
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    if (doctor?._id) {
      getUserCountByDoctorId(doctor?._id).subscribe(result => {
        setCount(result.total);
      });
    }
    return () => {
    }
  }, [doctor?._id])

  if (!doctor) {
    return (<Spinner/>);
  } else {
    return (
      <>
        <Caption style={styles.m3}> 您现有 {count} 个已关注病患。 </Caption>
        <ListItem key={1} bottomDivider onPress={() => navigate('RelationshipScreen')}>
          <Ionicons name="ios-filing" size={24} color="sandybrown" />
          <ListItem.Content>
            <ListItem.Title>查看已关注患者</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <Text> </Text>
        <ListItem key={2} bottomDivider onPress={() => navigate('PatientAuditScreen')}>
          <Ionicons name="ios-switch" size={24} color="royalblue"/>
          <ListItem.Content>
            <ListItem.Title>病患审核</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <Text> </Text>

      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
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