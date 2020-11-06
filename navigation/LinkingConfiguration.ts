import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          TabConsult:  'consult',                      
          TabFeedback: {
            screens: {
              TabFeedbackScreen: 'feedback',
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
            },
          },
        },
      },
      SignIn: 'signin',
      NotFound: '*',
    },
  },
};
