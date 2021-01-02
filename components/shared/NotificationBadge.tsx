import React from "react";
import { View, Text } from "react-native";
import { Badge } from 'react-native-elements';

export default function NotificationBadge({ notiLength }: { notiLength?: number }) {

  return (
    <>
      {notiLength && notiLength > 0 && (
        <View style={{ flexDirection: 'row', paddingHorizontal: 8 }}>
          <Badge status="success" value={notiLength}></Badge>
          <Text style={{ paddingLeft: 3, color: 'gray', fontSize: 12, alignSelf: 'center' }}>病患</Text>
        </View>
      )}
    </>
  );
}
