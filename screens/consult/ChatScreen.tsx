import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Button } from 'react-native-elements';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { AppState } from '../../models/app-state.model';

export default function ChatScreen() {
  const navigation = useNavigation();
  const doctor = useSelector((state: AppState) => state.doctor)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab On三十一e{doctor?.name}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button
        title="Go to ChatScreen... again"
        onPress={() => navigation.navigate('ChatScreen', { id: '几点开始了对方' })}
      />

      <Button
        title="Go Back"
        onPress={() => navigation.goBack()}
      />

      <Button
        title="Go feedback"
        onPress={() => navigation.navigate('feedback', { screen: 'TabFeedbackScreen' })}
      />
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
