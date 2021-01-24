import * as React from "react";
import { Auth } from "../../models/auth.model";
import { getAppSettings, getDoctor, getHospital, getToken } from "./local.store";

export const getAuthState = () => {
  // check if in local storage
  return Promise.all([
    getToken(),
    getDoctor(),
    getHospital(),
    getAppSettings(),
  ]).then(([token, doctor, hospital, appSettings]) => {
    if (token && doctor) {
      return {
        token,
        doctor,
        hospital,
        appSettings
      } as Auth;
    } else {
      return {
      } as Auth;
    }
  })
    .catch(err => ({ } as Auth));
}
