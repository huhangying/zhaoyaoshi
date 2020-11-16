import * as React from "react";
import { AppState } from "../../models/app-state.model";
import { clearLocalStorage, setDoctor, setToken } from "./local.store";

export enum AppStoreActionType {
  UpdateLoading,
  UpdateDoctor,
  UpdateToken,
  UpdateChatNotifications,
  UpdateFeedbackNotifications,
  UpdateConsultNotifications,
  Reset,
}

export interface AppStoreAction {
  type: AppStoreActionType,
  payload?: any;
}

// export const AppContext = React.createContext(new AppStoreService());
export const appStoreInitialState = new AppState();

export function appStoreReducer(state: AppState, action: AppStoreAction) {
  switch (action.type) {
    case AppStoreActionType.UpdateLoading:
      return {...state, loading: action.payload};

    case AppStoreActionType.UpdateDoctor:
      setDoctor(action.payload);
      return {...state, doctor: action.payload};

    case AppStoreActionType.UpdateToken:
      setToken(action.payload);
      return {...state, token: action.payload};

    case AppStoreActionType.UpdateChatNotifications:
      return {...state, chatNotifications: action.payload};

    case AppStoreActionType.UpdateFeedbackNotifications:
      return {...state, feedbackNotifications: action.payload};

    case AppStoreActionType.UpdateConsultNotifications:
      return {...state, consultNotifications: action.payload};

    case AppStoreActionType.Reset:
      // clear localstorage
      clearLocalStorage();
      return appStoreInitialState;

    default:
      throw new Error();
  }
}
