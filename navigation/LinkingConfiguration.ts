import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';

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
  subscribe(listener) {
    const onReceiveURL = ({ url }: { url: string }) => listener(url);

    // Listen to incoming links from deep linking
    Linking.addEventListener('url', onReceiveURL);

    // Listen to expo push notifications
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      const url = response.notification.request.content.data.url;

      // Any custom logic to see whether the URL needs to be handled
      //...
      // alert(JSON.stringify(response.notification.request.content.data))
      // Let React Navigation handle the URL
      listener(url);
    });

    return () => {
      // Clean up the event listeners
      Linking.removeEventListener('url', onReceiveURL);
      subscription.remove();
    };
  },
};
