import React from 'react';
import { StyleSheet, View } from 'react-native';
import *  as qqface from 'wx-qqface';
import { Image } from 'react-native-elements';
import { getEmojiPathByCode } from './ChatHelper';

export default function EmojiMenu({ onSelect }: { onSelect: any }) {
  const qqfaces: number[] = qqface.codeMap;

  const selectEmoji = (code: number) => {
    const emoji = '/:' + qqface.codeToText(code) + ' ';
    onSelect(emoji);
  }

  return (
    <View style={styles.container}>
      {qqfaces.map((code, i) => (
        i < 90 &&
        <Image key={'qqc' + i} onPress={() => selectEmoji(code)}
          source={{ uri: getEmojiPathByCode(code) }}
          style={styles.icon}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignContent: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    paddingTop: 2,
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 2,
    marginVertical: 2,
  }
});
