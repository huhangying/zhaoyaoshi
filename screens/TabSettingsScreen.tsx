import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { AuthContext, logout } from '../services/core/auth';
import { imgPath } from '../services/core/image.service';

export default function TabSettingsScreen() {
  const {navigate} = useNavigation();
  const auth = React.useContext(AuthContext);
  return (
    <>
      <ListItem key={0} bottomDivider onPress={() => navigate('ProfileScreen')}>
        <Avatar size="medium" source={{ uri: imgPath(auth.doctor?.icon) }} />
        <ListItem.Content>
          <ListItem.Title>{auth.doctor?.name}{auth.doctor?.title}</ListItem.Title>
          <ListItem.Subtitle>{auth.doctor?.department}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
      <ListItem key={1} bottomDivider>
        <Ionicons name="ios-pricetags" size={24} />
        <ListItem.Content>
          <ListItem.Title>付费咨询设置</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
      <ListItem key={2} bottomDivider>
        <Ionicons name="ios-color-palette" size={24} />
        <ListItem.Content>
          <ListItem.Title>设置</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
      <ListItem key={3} bottomDivider>
        <Ionicons name="ios-podium" size={24} />
        <ListItem.Content>
          <ListItem.Title>统计信息</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
      <ListItem key={4} onPress={() => logout()}>
        <Ionicons name="ios-power" size={24} />
        <ListItem.Content>
          <ListItem.Title>退出登录</ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </>
  );
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
});
