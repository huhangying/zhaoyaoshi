import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { TabConsultParamList } from '../models/types';

export default function TabConsultScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab On三十一e</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/consult/ChatScreen.js" />
      <Button title="go chat" onPress={() => {
        // navigation.setOptions
        navigation.navigate('ChatScreen');
      }} />
    </View>
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
