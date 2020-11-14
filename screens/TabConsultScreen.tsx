import { useNavigation } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { Button, StyleSheet } from 'react-native';
import { Divider, Header } from 'react-native-elements';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { AppContext } from '../services/core/state.context';

export default function TabConsultScreen() {
  const navigation = useNavigation();
  const { doctor } = React.useContext(AppContext);

  return (
    <>
      <Header
        statusBarProps={{ barStyle: 'light-content' }}
        barStyle="light-content" // or directly
        leftComponent={{ icon: 'home', style: { color: '#fff' } }}
        centerComponent={{ text: 'MY TITLE', style: { color: '#fff' } }}
        containerStyle={{
          backgroundColor: '#3D6DCC',
          justifyContent: 'space-around',
        }}
      />
      <Divider style={{ backgroundColor: 'lightgray' }} />
      <View style={styles.container}>
        <Text style={styles.title}>{doctor?.name}</Text>
        <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />


        <EditScreenInfo path="/screens/consult/ChatScreen.js" />
        <Button title="go chat" onPress={() => {
          // navigation.setOptions
          navigation.navigate('ChatScreen');
        }} />
      </View>
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
