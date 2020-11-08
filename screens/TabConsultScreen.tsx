import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { AuthContext } from '../services/core/auth';

export default function TabConsultScreen() {
  const navigation = useNavigation();   
  const auth = React.useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{auth.doctor?.name}</Text>
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
