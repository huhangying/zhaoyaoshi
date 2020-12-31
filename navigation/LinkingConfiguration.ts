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
              ChatScreen: 'chat',
              SelectChatScreen: 'select-chat',
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
              NotificationSettingsScreen: 'notification-settings',
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
