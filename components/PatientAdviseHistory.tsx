import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { User } from '../models/crm/user.model';
import { Text } from './Themed';
import Spinner from './shared/Spinner';


export default function PatientAdviseHistory({ user }: { user: User }) {

  useEffect(() => {
    return () => {
    }
  }, [user])


  if (!user?._id) {
    return (<Spinner />);
  } else {
    return (
      <ScrollView style={{minHeight: 278 }}>
        <Text style={styles.alert}>该病患暂无线下咨询历史记录。</Text>
      </ScrollView>
    )
  }
}


const styles = StyleSheet.create({
  alert: {
    padding: 16,
    marginVertical: 16,
    marginHorizontal: 0,
    backgroundColor: 'lightyellow',
  },
  headerTitle: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  content: {
    marginTop: 16,
  },
  item: {
    paddingVertical: 10,
  }
});
