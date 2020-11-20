import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import Config from '../../constants/config';

export default function AboutScreen() {

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
