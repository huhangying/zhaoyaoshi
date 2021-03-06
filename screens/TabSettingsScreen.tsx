import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../models/app-state.model';
import { imgSource } from '../services/core/image.service';
import { Text } from '../components/Themed';
import Spinner from '../components/shared/Spinner';
import { clearLocalStorage } from '../services/core/local.store';
import { updateIsLoggedIn } from '../services/core/app-store.actions';

export default function TabSettingsScreen() {
  const { navigate } = useNavigation();
  const doctor = useSelector((state: AppState) => state.doctor);
  const dispatch = useDispatch()

  const logout = () => {
    clearLocalStorage().then(() => {
      dispatch(updateIsLoggedIn(false));      
    });
  }

  if (!doctor) {
    return (<Spinner />);
  } else {
    return (
      <>
        <Text> </Text>
        <ListItem key={0} bottomDivider onPress={() => navigate('ProfileScreen')}>
          <Avatar size="medium" source={imgSource(doctor?.icon)} />
          <ListItem.Content>
            <ListItem.Title>{doctor?.name}{doctor?.title}</ListItem.Title>
            <ListItem.Subtitle>{doctor?.department?.name}</ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <Text> </Text>
        <ListItem key={1} bottomDivider onPress={() => navigate('ConsultSettingsScreen')}>
          <Ionicons name="ios-pricetags" size={24} color="orange" />
          <ListItem.Content>
            <ListItem.Title>付费咨询设置</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem key={2} bottomDivider onPress={() => navigate('NotificationSettingsScreen')}>
          <Ionicons name="ios-color-palette" size={24} color="purple" />
          <ListItem.Content>
            <ListItem.Title>设置</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem key={3} bottomDivider onPress={() => navigate('ShortcutSettingsScreen')}>
          <Ionicons name="ios-arrow-undo" color="seagreen" size={24} />
          <ListItem.Content>
            <ListItem.Title>快捷回复设置</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <ListItem key={4} bottomDivider onPress={() => navigate('AboutScreen')}>
          <Ionicons name="ios-information-circle-outline" size={24} color="lightblue" />
          <ListItem.Content>
            <ListItem.Title>关于</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
        <Text> </Text>
        <ListItem key={5} onPress={logout}>
          <Ionicons name="ios-power" size={24} color="red" />
          <ListItem.Content>
            <ListItem.Title>退出登录</ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
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
});
