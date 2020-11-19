import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import { ListItem } from 'react-native-elements';
import { Caption } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { Text, View } from '../components/Themed';
import { AppState } from '../models/app-state.model';

export default function TabPatientScreen() {
  const { navigate } = useNavigation();
  const doctor = useSelector((state: AppState) => state.doctor);
  if (!doctor) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <>
        <Caption> 病患管理 </Caption>
        <ListItem key={1} bottomDivider onPress={() => navigate('ConsultSettingsScreen')}>
          <Ionicons name="ios-pricetags" size={24} />
          <ListItem.Content>
            <ListItem.Title>查看已关注的患者</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem key={2} bottomDivider>
          <Ionicons name="ios-color-palette" size={24} />
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
    margin: 16
  },
});