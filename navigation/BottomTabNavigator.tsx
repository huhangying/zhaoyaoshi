import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import TabConsultScreen from '../screens/TabConsultScreen';
import TabSettingsScreen from '../screens/TabSettingsScreen';
import TabManageScreen from '../screens/TabManageScreen';
import TabFeedbackScreen from '../screens/TabFeedbackScreen';
import { BottomTabParamList, TabConsultParamList, TabSettingsParamList, TabManageParamList, TabFeedbackParamList } from '../models/types';
import ChatScreen from '../screens/consult/ChatScreen';
import ProfileScreen from '../screens/settings/ProfileScreen';
import { AppContext } from '../services/core/state.context';
import { getUnreadCount } from '../services/notification.service';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const BottomTab = createMaterialBottomTabNavigator();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();
  const { chatNotifications, feedbackNotifications, consultNotifications } = React.useContext(AppContext);

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
          tabBarBadge: getUnreadCount(chatNotifications),
        }}
      />
      <BottomTab.Screen
        name="feedback"
        component={TabFeedbackNavigator}
        options={{
          title: '反馈',
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-code" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="manage"
        component={TabManageNavigator}
        options={{
          title: '管理',
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-cog" color={color} />,
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
    </TabFeedbackStack.Navigator>
  );
}

const TabManageStack = createStackNavigator<TabManageParamList>();

function TabManageNavigator() {
  return (
    <TabManageStack.Navigator>
      <TabManageStack.Screen
        name="TabManageScreen"
        component={TabManageScreen}
        options={{ headerTitle: '病患管理' }}
      />
    </TabManageStack.Navigator>
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
    </TabSettingsStack.Navigator>
  );
}