import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from '../../models/app-state.model';
import { Doctor } from '../../models/crm/doctor.model';

const setDoctor = async (doctor: Doctor) => {
  try {
    await AsyncStorage.setItem('@doctor', JSON.stringify(doctor))
  } catch (e) {
    // saving error
  }
}

const setToken = async (token = '') => {
  try {
    await AsyncStorage.setItem('@token', token)
  } catch (e) {
    // saving error
  }
}

const getDoctor = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@doctor')
    return jsonValue != null ? (JSON.parse(jsonValue) as Doctor) : undefined;
  } catch (e) {
    // error reading value
  }
}

const getToken = async () => {
  try {
    return await AsyncStorage.getItem('@token') as string;
  } catch (e) {
    // error reading value
  }
}

const clearLocalStorage = async () => {
  try {
    return await AsyncStorage.clear();
  } catch (e) {
    // error reading value
  }
}

const setAppState = async (appState: AppState) => {
  try {
    await AsyncStorage.setItem('@appstate', JSON.stringify(appState))
  } catch (e) {
    // saving error
  }
}

const getAppState = async () => {
  try {
    return await AsyncStorage.getItem('@appstate') as AppState;
  } catch (e) {
    // error reading value
  }
}

export {
  setDoctor,
  setToken,
  getDoctor,
  getToken,
  clearLocalStorage,
  setAppState,
  getAppState,
};