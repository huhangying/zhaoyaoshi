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
      SignInScreen: 'signin',
      NotFound: '*',
    },
  },
};
