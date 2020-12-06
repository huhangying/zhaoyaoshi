import { AppState } from "../../models/app-state.model";
import { Doctor } from "../../models/crm/doctor.model";
import { Notification } from "../../models/io/notification.model";

export enum AppStoreActionType {
  UpdateLoading,
  UpdateErrorMessage,

  UpdateDoctor,
  UpdateToken,
  UpdateChatNotifications,
  UpdateFeedbackNotifications,
  UpdateConsultNotifications,

  UpdateHideBottomBar,
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

export const UpdateHideBottomBar = (hideBottomBar: boolean) => (
  {
    type: AppStoreActionType.UpdateHideBottomBar,
    payload: hideBottomBar,
  }
);

export const resetStore = () => (
  {
    type: AppStoreActionType.Reset,
  }
);

