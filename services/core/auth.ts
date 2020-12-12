import * as React from "react";
import { Auth } from "../../models/auth.model";
import { clearLocalStorage, getDoctor, getToken } from "./local.store";
import RNRestart from 'react-native-restart';

export const getAuthState = () => {
  // check if in local storage
  return Promise.all([
    getToken(),
    getDoctor()
  ]).then(([token, doctor]) => {
    if (token && doctor) {
      return {
        isLoggedIn: true,
        token,
        doctor,
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
