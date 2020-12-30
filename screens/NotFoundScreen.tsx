import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import Spinner from '../components/shared/Spinner';
import { getAuthState } from '../services/core/auth';

export default function NotFoundScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    getAuthState().then(_ => {
      if (_.doctor && _.token) {
        navigation.reset({ index: 0, routes: [{ name: 'Root' }] });
      } else {
        navigation.navigate('SignIn');
      }
    })
    return () => {
    }
  }, [navigation])
  return (<Spinner />);
}
