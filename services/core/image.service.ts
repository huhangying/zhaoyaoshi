import * as Config from './../../constants/config';

export const imgPath = (path?: string) => {
  if (!path) {
    return require('../../assets/images/noimage.jpg');
  }

  return Config.default.imageServer + path;
}

export const imgSource = (path?: string) => {
  if (!path) {
    return require('../../assets/images/noimage.jpg');
  }

  return { uri: Config.default.imageServer + path };
}

export const wxImgSource = (path?: string) => {
  if (!path) {
    return require('../../assets/images/noimage.jpg');
  }

  return { uri: path };
}
