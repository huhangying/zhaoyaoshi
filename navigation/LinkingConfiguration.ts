import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          TabConsult:  {
            screens: {
              TabConsultScreen: 'consult',
            },
          },                      
          TabFeedback: {
            screens: {
              TabFeedbackScreen: 'feedback',
              BookingsScreen: 'bookings'
            },
          },
          TabManage: {
            screens: {
              TabManageScreen: 'manage',
            },
          },
          TabSettings: {
            screens: {
              TabSettingsScreen: 'settings',
              ProfileScreen: 'profile',
              ConsultSettingsScreen: 'consult-settings',
              ShortcutSettingsScreen: 'shortcut-settings'
            },
          },
        },
      },
      SignInScreen: 'signin',
      NotFound: '*',
    },
  },
};
