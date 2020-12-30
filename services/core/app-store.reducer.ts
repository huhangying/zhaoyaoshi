import { AppState } from "../../models/app-state.model";
import { AppStoreAction, AppStoreActionType } from "./app-store.actions";
import { clearLocalStorage, setDoctor, setToken } from "./local.store";

// export const AppContext = React.createContext(new AppStoreService());
export const appStoreInitialState = new AppState();

export function appStoreReducer(state: AppState = appStoreInitialState, action: AppStoreAction): AppState {
  switch (action.type) {
    case AppStoreActionType.UpdateDoctor:
      setDoctor(action.payload);
      return { ...state, doctor: action.payload };

    case AppStoreActionType.UpdateToken:
      setToken(action.payload);
      return { ...state, token: action.payload };

    case AppStoreActionType.UpdateIsLoggedIn:
      return { ...state, isLoggedIn: action.payload };

    case AppStoreActionType.UpdateChatNotifications:
      return { ...state, chatNotifications: action.payload };

    case AppStoreActionType.UpdateFeedbackNotifications:
      return { ...state, feedbackNotifications: action.payload };

    case AppStoreActionType.UpdateConsultNotifications:
      return { ...state, consultNotifications: action.payload };

    case AppStoreActionType.UpdateLoading:
      return { ...state, loading: action.payload };

    case AppStoreActionType.UpdateErrorMessage:
      return { ...state, errorMessage: action.payload };

    case AppStoreActionType.UpdateHideBottomBar:
      return { ...state, hideBottomBar: action.payload };

    case AppStoreActionType.UpdateIoService:
      return { ...state, ioService: action.payload };

    case AppStoreActionType.Reset:
      // clear localstorage
      clearLocalStorage();
      return appStoreInitialState;


    // case FOREGROUND:
    //   return 'back to foreground';
    // case BACKGROUND:
    // case INACTIVE:
    //   return 'inactive';
    default:
      return state
  }
}
