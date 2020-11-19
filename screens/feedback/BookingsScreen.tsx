import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Divider, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import { useStore } from 'react-redux';

export default function BookingsScreen() {
  const navigation = useNavigation();
  const doctor = useStore().getState().doctor;

  useEffect(() => {
    return () => {
    }
  }, [])

  return (
    <ScrollView>

    </ScrollView>
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
