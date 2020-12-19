import React from "react";
import { getEmojiPath, isEmoji, parseChatData } from "../chat/ChatHelper";

import { Text, View } from "../Themed";
import { Image } from 'react-native-elements';
import { useWindowDimensions } from "react-native";

export default function TextAndEmoji({ data }: { data: string}) {
  const screenWidth = useWindowDimensions().width;
  
  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'transparent' }}>
      {parseChatData(data).map((text, i) => (isEmoji(text) ? (
        <Image key={i}
          source={{ uri: (getEmojiPath(text)) }} style={{ width: 20, height: 20, marginHorizontal: 2 }} />
      ) : (
          <Text key={i} style={{maxWidth: screenWidth - 100}}>
            {text}
          </Text>
        )
      ))
      }
    </View>
  );
}
