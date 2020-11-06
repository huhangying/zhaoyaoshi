import AsyncStorage from '@react-native-async-storage/async-storage';
import { Doctor } from '../../models/crm/doctor.model';

const setDoctor = async (doctor: Doctor) => {
  try {
    await AsyncStorage.setItem('@doctor', JSON.stringify(doctor))
  } catch (e) {
    // saving error
  }
}

const setToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('@token', token)
  } catch (e) {
    // saving error
  }
}

const getDoctor = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@doctor')
    return jsonValue != null ? (JSON.parse(jsonValue) as Doctor) : null;
  } catch(e) {
    // error reading value
  }
}

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('@token') as string;
  } catch(e) {
    // error reading value
  }
}

const clearLocalStorage = () => {
  try {
  AsyncStorage.clear();
} catch(e) {
  // error reading value
}
}

export { 
  setDoctor,
  setToken,
  getDoctor,
  getToken,
  clearLocalStorage,
};