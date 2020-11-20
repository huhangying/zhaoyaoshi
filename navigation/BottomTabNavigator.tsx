import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import TabConsultScreen from '../screens/TabConsultScreen';
import TabSettingsScreen from '../screens/TabSettingsScreen';
import TabPatientScreen from '../screens/TabPatientScreen';
import TabFeedbackScreen from '../screens/TabFeedbackScreen';
import { TabSettingsParamList, TabPatientParamList, TabFeedbackParamList } from '../models/types';
import ChatScreen from '../screens/consult/ChatScreen';
import ProfileScreen from '../screens/settings/ProfileScreen';
import { getUnreadCount } from '../services/notification.service';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { useSelector } from 'react-redux';
import { AppState } from '../models/app-state.model';
import ConsultSettingsScreen from '../screens/settings/ConsultSettingsScreen';
import ShortcutSettingsScreen from '../screens/settings/ShortcutSettingsScreen';
import BookingsScreen from '../screens/feedback/BookingsScreen';
import AboutScreen from '../screens/settings/AboutScreen';

const BottomTab = createMaterialBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const state = useSelector((state: AppState) => state);

  return (
    <BottomTab.Navigator
      initialRouteName="consult"
      activeColor={Colors[colorScheme].tint}
      inactiveColor={Colors[colorScheme].text}
      barStyle={{ backgroundColor: Colors[colorScheme].background }}  >
      <BottomTab.Screen
        name="consult"
        component={TabConsultNavigator}
        options={{
          title: '咨询',
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-chatbubbles" color={color} />,
          tabBarBadge: getUnreadCount(state.chatNotifications),
        }}
      />
      <BottomTab.Screen
        name="feedback"
        component={TabFeedbackNavigator}
        options={{
          title: '门诊',
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-medkit" color={color} />,
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
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-contact" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: string; color: string }) {
  return <Ionicons size={26} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const TabConsultStack = createStackNavigator();

function TabConsultNavigator() {
  return (
    <TabConsultStack.Navigator>
      <TabConsultStack.Screen
        name="TabConsult"
        component={TabConsultScreen}
        options={{ headerTitle: '药师咨询', headerShown: false }}
      />
      <TabConsultStack.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{ headerTitle: '免费咨询' }}
      />
    </TabConsultStack.Navigator>
  );
}

const TabFeedbackStack = createStackNavigator<TabFeedbackParamList>();

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
        options={{ headerTitle: '您的病患预约' }}
      />
    </TabFeedbackStack.Navigator>
  );
}

const TabPatientStack = createStackNavigator<TabPatientParamList>();

function TabPatientNavigator() {
  return (
    <TabPatientStack.Navigator>
      <TabPatientStack.Screen
        name="TabPatientScreen"
        component={TabPatientScreen}
        options={{ headerTitle: '病患管理' }}
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