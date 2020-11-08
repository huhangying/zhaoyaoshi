import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-elements';
import { getAuthState } from '../services/core/auth';

export default function NotFoundScreen() {
  const navigation = useNavigation();

  React.useEffect(() => {
    setTimeout(() => {
      getAuthState().then(_ => {
        console.log('->', _.isLoggedIn);
        
        if (_.isLoggedIn) {
          navigation.navigate('Root');
        } else {
          navigation.navigate('SignIn');
        }
      })
    })
    return () => {      
    }
  }, [])
  return (
    <></>
    // <View style={styles.container}>
    //   <Text style={styles.title}>页面不存在。</Text>
    //   <TouchableOpacity onPress={() => navigation.navigate('Root')} style={styles.link}>
    //     <Text style={styles.linkText}>回到首页!</Text>
    //   </TouchableOpacity>
    //   <Button title="Login" onPress={() => navigation.navigate('SignIn')} />
    // </View>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   link: {
//     marginTop: 15,
//     paddingVertical: 15,
//   },
//   linkText: {
//     fontSize: 14,
//     color: '#2e78b7',
//   },
// });
