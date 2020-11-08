import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { clearLocalStorage } from '../services/core/local.store';
import { refreshPage } from '../services/core/auth';

export default function TabFeedbackScreen() {
  const navigation = useNavigation();
  // console.log(this.props);

  function logout() {
    clearLocalStorage().then(() => {
      refreshPage();
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab Two</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabFeedbackScreen.js" />
      <Button title="Sign out" onPress={() => logout()} />
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
