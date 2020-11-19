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
          TabPatient: {
            screens: {
              TabPatientScreen: 'patient',
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
