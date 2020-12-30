import * as React from "react";
import { Auth } from "../../models/auth.model";
import { getDoctor, getHospital, getToken } from "./local.store";

export const getAuthState = () => {
  // check if in local storage
  return Promise.all([
    getToken(),
    getDoctor(),
    getHospital(),
  ]).then(([token, doctor, hospital]) => {
    if (token && doctor) {
      return {
        token,
        doctor,
        hospital,
      } as Auth;
    } else {
      return {
      } as Auth;
    }
  })
    .catch(err => ({ } as Auth));
}
