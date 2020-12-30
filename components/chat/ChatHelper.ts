import Constants from 'expo-constants';
import *  as qqface from 'wx-qqface';

// separate emoji and other text => list
export const parseChatData = (text: string): string[] => {
  if (!text) return [''];
  return text.split(/(\/:[\p{L}]{1,2}\s)/gu).filter(_ => _ !== ''); // {1,2}: 支持 /：微笑 /：酷
}

export const isEmoji = (text: string): boolean => {
  return text.indexOf('/:') > -1;
}

export const getEmojiPath = (text: string) => {
  const code = qqface.textMap.indexOf(text.substr(2, text.length - 3)) + 1;
  return code ? `${Constants.manifest.extra.imageServer}/assets/qqface/${code}.gif` : '';
}

export const getEmojiPathByCode = (code: number) => {
  return code ? `${Constants.manifest.extra.imageServer}/assets/qqface/${code}.gif` : '';
}

//==================================================================
