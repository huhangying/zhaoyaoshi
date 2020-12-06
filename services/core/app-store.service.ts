import { AppState } from "../../models/app-state.model";
import { Doctor } from "../../models/crm/doctor.model";
import { clearLocalStorage, setDoctor, setToken } from "./local.store";
import { Store } from "./store";
import { Notification } from "../../models/io/notification.model";

export class AppStoreService extends Store<AppState> {
  constructor(initState?: AppState) {
    super(new AppState());
    if (initState) {
      this.setState(initState);
    }
  }

  // selectors
  get token() { return this.state?.token; }
  get doctor() { return this.state?.doctor; }
  get chatNotifications() { return this.state?.chatNotifications; }
  get feedbackNotifications() { return this.state?.feedbackNotifications; }
  get consultNotifications() { return this.state?.consultNotifications; }
  // get token() { return this.state?.token || getToken(); }
  // get doctor() { return this.state?.doctor || getDoctor(); }

  get loading() { return this.state?.loading; }
  get errorMessage() { return this.state?.errorMessage; }
  get hideBottomBar() { return this.state?.hideBottomBar; }

  updateDoctor(doctor?: Doctor) {
    if (doctor) {
      this.setState({
        ...this.state,
        doctor,
      });
      setDoctor(doctor);
    }
  }

  updateToken(token?: string) {
    if (token) {
      this.setState({
        ...this.state,
        token,
      });
      setToken(token);
    }
  }

  updateChatNotifications(chatNotifications: Notification[]) {
    this.setState({
      ...this.state,
      chatNotifications,
    });
  }

  updateFeedbackNotifications(feedbackNotifications: Notification[]) {
    this.setState({
      ...this.state,
      feedbackNotifications,
    });
  }

  updateConsultNotifications(consultNotifications: Notification[]) {
    this.setState({
      ...this.state,
      consultNotifications,
    });
  }

  updateLoading(loading: boolean) {
    this.setState({
      ...this.state,
      loading,
    });
  }

  updateErrorMessage(errorMessage: string) {
    this.setState({
      ...this.state,
      errorMessage,
    });
  }

  updateHideBottomBar(hideBottomBar: boolean) {
    this.setState({
      ...this.state,
      hideBottomBar,
    });
  }

  reset() {
    this.setState(new AppState());
    // clear localstorage
    clearLocalStorage();
  }

}
