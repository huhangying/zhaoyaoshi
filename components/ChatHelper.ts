import *  as qqface from 'wx-qqface';
import * as Config from './../constants/config';

// separate emoji and other text => list

export const chatDataList = (text: string): string[] => {
  if (!text) return [''];
  return text.split(/(\/:[\p{L}]{1,2}\s)/gu).filter(_ => _ !== ''); // {1,2}: 支持 /：微笑 /：酷
}

export const isEmoji = (text: string): boolean => {
  return text.indexOf('/:') > -1;
}

export const getEmojiPath = (text: string) => {
  const code = qqface.textMap.indexOf(text.substr(2, text.length - 3)) + 1;
  return code ? `${Config.default.imageServer}/assets/qqface/${code}.gif` : '';
}