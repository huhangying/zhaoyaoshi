import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        initialRouteName: "TabConsultScreen",
        screens: {
          consult: {
            path: 'consult',
            screens: {
              TabConsultScreen: '',
              ConsultChatScreen: 'consult-chat',
              ChatScreen: 'chat',
              SelectChatScreen: 'select-chat',
            },
          },
          feedback: {
            path: 'feedback',
            screens: {
              TabFeedbackScreen: '',
              BookingsScreen: 'bookings',
              FeedbackChatScreen: 'feedback-chat',
            },
          },
          patient: {
            path: 'patient',
            screens: {
              TabPatientScreen: '',
              RelationshipScreen: 'relationship',
              PatientAuditScreen: 'patient-audit',
            },
          },
          settings: {
            path: 'settings',
            screens: {
              TabSettingsScreen: '',
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
