import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../models/app-state.model';
import { Text, View } from '../../components/Themed';

export default function BookingsScreen() {
  const navigation = useNavigation();
  const doctor = useSelector((state: AppState) => state.doctor);

  useEffect(() => {
    return () => {
    }
  }, [doctor?._id])

  return (
    <>
      <ScrollView>

      </ScrollView>
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
