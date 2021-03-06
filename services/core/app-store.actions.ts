import { AppSettings, Toaster } from "../../models/app-settings.model";
import { AppState } from "../../models/app-state.model";
import { Doctor } from "../../models/crm/doctor.model";
import { NotiPage } from "../../models/io/noti-page.model";
import { Notification } from "../../models/io/notification.model";
import { SocketioService } from "./socketio.service";

export enum AppStoreActionType {
  UpdateLoading,
  UpdateErrorMessage,
  UpdateSnackbar,
  UpdateIsLoggedIn,
  UpdateNotiPage,

  UpdateDoctor,
  UpdateToken,
  UpdateAppSettings,
  UpdateChatNotifications,
  UpdateFeedbackNotifications,
  UpdateConsultNotifications,

  UpdateHideBottomBar,
  UpdateIoService,
  Reset,
}

export interface AppStoreAction {
  type: AppStoreActionType,
  payload?: any;
}

// export const AppContext = React.createContext(new AppStoreService());
export const appStoreInitialState = new AppState();


export const updateDoctor = (doctor: Doctor) => (
  {
    type: AppStoreActionType.UpdateDoctor,
    payload: doctor,
  }
);
export const updateToken = (token = '') => (
  {
    type: AppStoreActionType.UpdateToken,
    payload: token,
  }
);
export const updateAppSettings = (appSettings: AppSettings) => (
  {
    type: AppStoreActionType.UpdateAppSettings,
    payload: appSettings,
  }
);

export const updateChatNotifications = (chatNotifications: Notification[]) => (
  {
    type: AppStoreActionType.UpdateChatNotifications,
    payload: chatNotifications,
  }
);
export const updateFeedbackNotifications = (feedbackNotifications: Notification[]) => (
  {
    type: AppStoreActionType.UpdateFeedbackNotifications,
    payload: feedbackNotifications,
  }
);
export const updateConsultNotifications = (consultNotifications: Notification[]) => (
  {
    type: AppStoreActionType.UpdateConsultNotifications,
    payload: consultNotifications,
  }
);

export const UpdateLoading = (loading: boolean) => (
  {
    type: AppStoreActionType.UpdateLoading,
    payload: loading,
  }
);

export const UpdateErrorMessage = (errorMessage: string) => (
  {
    type: AppStoreActionType.UpdateErrorMessage,
    payload: errorMessage,
  }
);

export const updateSnackbar = (msg: string, type=0) => (
  {
    type: AppStoreActionType.UpdateSnackbar,
    payload: {
      type: type,
      msg: msg
    },
  }
);

export const updateIsLoggedIn = (isLoggedIn: boolean) => (
  {
    type: AppStoreActionType.UpdateIsLoggedIn,
    payload: isLoggedIn,
  }
);

export const updateNotiPage = (notiPage?: NotiPage) => (
  {
    type: AppStoreActionType.UpdateNotiPage,
    payload: notiPage,
  }
);

export const UpdateHideBottomBar = (hideBottomBar: boolean) => (
  {
    type: AppStoreActionType.UpdateHideBottomBar,
    payload: hideBottomBar,
  }
);

export const UpdateIoService = (ioService?: SocketioService) => (
  {
    type: AppStoreActionType.UpdateIoService,
    payload: ioService,
  }
);

export const resetStore = () => (
  {
    type: AppStoreActionType.Reset,
  }
);

