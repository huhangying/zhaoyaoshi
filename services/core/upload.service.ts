import { ImageInfo } from 'expo-image-picker/build/ImagePicker.types';
import { Platform } from 'react-native';
import { postApi } from './api.service';


export const uploadUserDir = (uid: string, type: string, file: Blob | File, fileName?: string) => {
  const formData = new FormData();
  formData.append('file', file, fileName);// pass new file name in
  return postApi<{ path: string }>(`upload/user/${uid}_${type + getRandomString(10)}`, formData);
}

export const uploadDoctorDir = (did: string, type: string, formData: FormData) => {

  return postApi<{ path: string }>(`upload/doctor/${did}_${type + getRandomString(10)}`, formData
    // , {
    //   reportProgress: true,
    //   observe: 'events'
    // }
  );
}

export const removeFile = (filePath: string) => {
  return postApi('upload/remove', { path: filePath });
}

export const createBlobFormData = async (photo: ImageInfo, fileName?: string) => {
  const uri = Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri;
  const formData = new FormData();
  formData.append('file', {uri: uri, name: fileName || '.png', type: 'multipart/form-data'});// pass new file name in
  return formData;
}

export const getRandomString = (length: number) => {
  const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}