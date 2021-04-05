import Constants from 'expo-constants';

export const imgPath = (path?: string) => {
  if (!path) {
    return require('../../assets/images/noimage.jpg');
  }

  return Constants.manifest.extra.imageServer + path;
}

export const iconPath = (path?: string) => {
  if (!path) {
    return '';
  }

  return Constants.manifest.extra.imageServer + path;
}

export const imgSource = (path?: string) => {
  if (!path) {
    return require('../../assets/images/noimage.jpg');
  }

  return { uri: Constants.manifest.extra.imageServer + path };
}

export const getAppLogo = () => {
  return require('../../assets/images/icon.png');
}

export const wxImgSource = (path?: string) => {
  if (!path) {
    return require('../../assets/images/noimage.jpg');
  }

  return { uri: path };
}
