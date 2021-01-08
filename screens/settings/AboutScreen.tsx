import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../../components/Themed';
import Constants from 'expo-constants';
import { Avatar } from 'react-native-elements';
import { getAppLogo } from '../../services/core/image.service';

export default function AboutScreen() {

  return (
    <View style={styles.container}>
      <Avatar
        size="large"
        source={getAppLogo()}
      />
      <Text> </Text>
      <Text style={styles.title}>{Constants.manifest.name}</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Text>版本号：{Constants.manifest.version}</Text>
      <Text> </Text>
      <Text>发布时间：{Constants.manifest.extra.versionDate}</Text>
      <Text> </Text>
      <Text>开发：{Constants.manifest.extra.company}</Text>
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
