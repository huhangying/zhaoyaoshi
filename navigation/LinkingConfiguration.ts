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
              ConsultChatScreen: 'consult-chat',
            },
          },                      
          TabFeedback: {
            screens: {
              TabFeedbackScreen: 'feedback',
              BookingsScreen: 'bookings',
              FeedbackChatScreen: 'feedback-chat',
            },
          },
          TabPatient: {
            screens: {
              TabPatientScreen: 'patient',
              RelationshipScreen: 'relationship',
              PatientAuditScreen: 'patient-audit',
            },
          },
          TabSettings: {
            screens: {
              TabSettingsScreen: 'settings',
              ProfileScreen: 'profile',
              ConsultSettingsScreen: 'consult-settings',
              ShortcutSettingsScreen: 'shortcut-settings',
              AboutScreen: 'about'
            },
          },
        },
      },
      SignInScreen: 'signin',
      NotFound: '*',
    },
  },
};
