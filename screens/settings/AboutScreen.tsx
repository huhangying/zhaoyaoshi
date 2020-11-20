import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Divider, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { imgPath } from '../../services/core/image.service';
import { useEffect } from 'react';
import { useStore } from 'react-redux';
import { View } from '../../components/Themed';
import Config from '../../constants/config';

export default function AboutScreen() {
  const navigation = useNavigation();
  const doctor = useStore().getState().doctor;

  useEffect(() => {
    return () => {
    }
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{Config.appName}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text>版本号：{Config.version}</Text>
      <Text> </Text>
      <Text>发布时间：{Config.versionDate}</Text>
      <Text> </Text>
      <Text>开发：{Config.company}</Text>
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
