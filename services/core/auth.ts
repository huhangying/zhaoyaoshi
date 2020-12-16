import * as React from "react";
import { Auth } from "../../models/auth.model";
import { clearLocalStorage, getDoctor, getHospital, getToken } from "./local.store";
import RNRestart from 'react-native-restart';

export const getAuthState = () => {
  // check if in local storage
  return Promise.all([
    getToken(),
    getDoctor(),
    getHospital(),
  ]).then(([token, doctor, hospital]) => {
    if (token && doctor) {
      return {
        isLoggedIn: true,
        token,
        doctor,
        hospital,
      } as Auth;
    } else {
      return {
        isLoggedIn: false
      } as Auth;
    }
  })
    .catch(err => ({ isLoggedIn: false } as Auth));
}



export const refreshPage = () => {
  // window.location.reload();
  RNRestart.Restart();
}

export function logout() {
  clearLocalStorage().then(() => {
    refreshPage();
  });
}
