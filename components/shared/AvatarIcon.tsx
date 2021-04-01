import React from "react";
import { StyleSheet } from 'react-native';
import { Avatar } from "react-native-elements";

export default function AvatarIcon({ icon, isDoctor }: { icon?: string, isDoctor?: boolean }) {

  return (
    <>
      {!icon ? (
        <Avatar
          containerStyle={styles.icon}
          rounded
          icon={{ name: isDoctor ? 'user-md' : 'user', color: isDoctor ? 'white' : 'lightgray', type: 'font-awesome' }}
          overlayContainerStyle={{ backgroundColor: isDoctor ? 'lightblue' : 'lightyellow' }}
        />
      ) : (
        <Avatar
          containerStyle={styles.icon}
          rounded
          source={{ uri: icon }}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  icon: {
    marginTop: 10,
    marginHorizontal: 4,
  }
});
