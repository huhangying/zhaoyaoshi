import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import TabConsultScreen from '../screens/TabConsultScreen';
import TabSettingsScreen from '../screens/TabSettingsScreen';
import TabPatientScreen from '../screens/TabPatientScreen';
import TabFeedbackScreen from '../screens/TabFeedbackScreen';
import { TabSettingsParamList } from '../models/types';
import ChatScreen from '../screens/consult/ChatScreen';
import ConsultScreen from '../screens/consult/ConsultScreen';
import ProfileScreen from '../screens/settings/ProfileScreen';
import { getUnreadCount } from '../services/notification.service';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../models/app-state.model';
import ConsultSettingsScreen from '../screens/settings/ConsultSettingsScreen';
import ShortcutSettingsScreen from '../screens/settings/ShortcutSettingsScreen';
import BookingsScreen from '../screens/feedback/BookingsScreen';
import AboutScreen from '../screens/settings/AboutScreen';
import RelationshipScreen from '../screens/patient/RelationshipScreen';
import PatientAuditScreen from '../screens/patient/PatientAuditScreen';
import FeedbackChatScreen from '../screens/feedback/FeedbackChatScreen';
import SelectChatScreen from '../screens/consult/SelectChatScreen';
import NotificationSettingsScreen from '../screens/settings/NotificationSettingsScreen';
import { Snackbar } from 'react-native-paper';
import { updateSnackbar } from '../services/core/app-store.actions';
import ConsultPhoneScreen from '../screens/consult/ConsultPhoneScreen';
import { MessageType } from '../models/app-settings.model';
import AdviseScreen from '../screens/consult/AdviseScreen';

const BottomTab = createMaterialBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch()
  const state = useSelector((state: AppState) => state);

  const onDismissSnackBar = () => {
    dispatch(updateSnackbar(''));
  };
  const getSnackbarColorByMsgType = (type?: MessageType) => {
    switch(type) {
      case MessageType.info:
        return '#0dcaf0';
      case MessageType.warn:
        return '#ffc107';
      case MessageType.success:
        return '#198754';
      case MessageType.error:
        return '#dc3545';
      default:
        return 'gray';    
    }
  }

  const getChatAndConsultUnreadCount = () => {
    const totalCount = (getUnreadCount(state.chatNotifications) || 0) +
      (getUnreadCount(state.consultNotifications) || 0);
    return totalCount > 0 ? totalCount : undefined;
  }
  

  return (
    <>
      <BottomTab.Navigator
        activeColor={Colors[colorScheme].tint}
        inactiveColor={Colors[colorScheme].tabIconDefault}
        barStyle={{ backgroundColor: Colors[colorScheme].background, display: state.hideBottomBar ? 'none' : 'flex' }}  >
        <BottomTab.Screen
          name="consult"
          component={TabConsultNavigator}
          options={{
            title: '咨询',
            tabBarIcon: ({ color }) => <TabBarIcon name="ios-chatbubbles" color={color} />,
            tabBarBadge: getChatAndConsultUnreadCount(),
          }}
        />
        <BottomTab.Screen
          name="feedback"
          component={TabFeedbackNavigator}
          options={{
            title: '门诊',
            tabBarIcon: ({ color }) => <TabBarIcon name="ios-medkit" color={color} />,
            tabBarBadge: getUnreadCount(state.feedbackNotifications),
          }}
        />
        <BottomTab.Screen
          name="patient"
          component={TabPatientNavigator}
          options={{
            title: '病患管理',
            tabBarIcon: ({ color }) => <TabBarIcon name="ios-people" color={color} />,
          }}
        />
        <BottomTab.Screen
          name="settings"
          component={TabSettingsNavigator}
          options={{
            title: '个人中心',
            tabBarIcon: ({ color }) => <TabBarIcon name="ios-person-circle" color={color} />,
          }}
        />
      </BottomTab.Navigator>
      <Snackbar
        visible={!!state.snackbar?.msg}
        style={{marginBottom: 60, backgroundColor: getSnackbarColorByMsgType(state.snackbar?.type)}}        
        duration={3000}
        onDismiss={onDismissSnackBar}>
        {state.snackbar?.msg}
      </Snackbar>
    </>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={26} style={{ marginTop: -4 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabConsultStack = createStackNavigator();

function TabConsultNavigator() {
  return (
    <TabConsultStack.Navigator>
      <TabConsultStack.Screen
        name="TabConsultScreen"
        component={TabConsultScreen}
        options={{ headerTitle: '药师咨询' }}
      />
      <TabConsultStack.Screen
        name="AdviseScreen"
        component={AdviseScreen}
        options={{ headerTitle: '药师咨询 - 线下咨询' }}
      />
      <TabConsultStack.Screen
        name="SelectChatScreen"
        component={SelectChatScreen}
        options={{ headerTitle: '药师咨询 - 病患选择' }}
      />
      <TabConsultStack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerTitle: '免费咨询', headerShown: false }}
        initialParams={{ type: '', title: '', pid: '' }}
      />
      <TabConsultStack.Screen
        name="ConsultScreen"
        component={ConsultScreen}
        options={{ headerTitle: '付费图片咨询', headerShown: false }}
      />
      <TabConsultStack.Screen
        name="ConsultPhoneScreen"
        component={ConsultPhoneScreen}
        options={{ headerTitle: '付费电话咨询', headerShown: false }}
      />
    </TabConsultStack.Navigator>
  );
}

const TabFeedbackStack = createStackNavigator();

function TabFeedbackNavigator() {
  return (
    <TabFeedbackStack.Navigator>
      <TabFeedbackStack.Screen
        name="TabFeedbackScreen"
        component={TabFeedbackScreen}
        options={{ headerTitle: '门诊反馈' }}
      />
      <TabConsultStack.Screen
        name="BookingsScreen"
        component={BookingsScreen}
        options={{ headerTitle: '门诊预约' }}
      />
      <TabConsultStack.Screen
        name="FeedbackChatScreen"
        component={FeedbackChatScreen}
        options={{ headerTitle: '门诊反馈', headerShown: false }}
      />
    </TabFeedbackStack.Navigator>
  );
}

const TabPatientStack = createStackNavigator();

function TabPatientNavigator() {
  return (
    <TabPatientStack.Navigator>
      <TabPatientStack.Screen
        name="TabPatientScreen"
        component={TabPatientScreen}
        options={{ headerTitle: '病患管理' }}
      />
      <TabPatientStack.Screen
        name="RelationshipScreen"
        component={RelationshipScreen}
        options={{ headerTitle: '查看已关注患者' }}
      />
      <TabPatientStack.Screen
        name="PatientAuditScreen"
        component={PatientAuditScreen}
        options={{ headerTitle: '病患审核' }}
      />
    </TabPatientStack.Navigator>
  );
}

const TabSettingsStack = createStackNavigator<TabSettingsParamList>();

function TabSettingsNavigator() {
  return (
    <TabSettingsStack.Navigator>
      <TabSettingsStack.Screen
        name="TabSettingsScreen"
        component={TabSettingsScreen}
        options={{ headerTitle: '个人中心' }}
      />
      <TabConsultStack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerTitle: '个人信息' }}
      />
      <TabConsultStack.Screen
        name="ConsultSettingsScreen"
        component={ConsultSettingsScreen}
        options={{ headerTitle: '付费咨询设置' }}
      />
      <TabConsultStack.Screen
        name="NotificationSettingsScreen"
        component={NotificationSettingsScreen}
        options={{ headerTitle: '设置' }}
      />
      <TabConsultStack.Screen
        name="ShortcutSettingsScreen"
        component={ShortcutSettingsScreen}
        options={{ headerTitle: '快捷回复设置' }}
      />
      <TabConsultStack.Screen
        name="AboutScreen"
        component={AboutScreen}
        options={{ headerTitle: '关于' }}
      />
    </TabSettingsStack.Navigator>
  );
}