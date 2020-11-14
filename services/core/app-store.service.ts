import { AppState } from "../../models/app.state";
import { Doctor } from "../../models/crm/doctor.model";
import { clearLocalStorage, getDoctor, getToken, setDoctor, setToken } from "./local.store";
import { Store } from "./store";

export class AppStoreService extends Store<AppState> {

  constructor(
  ) {
    super(new AppState());
  }

  // selectors
  get token() { return this.state?.token; }
  get doctor() { return this.state?.doctor; }
  // get token() { return this.state?.token || getToken(); }
  // get doctor() { return this.state?.doctor || getDoctor(); }

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

  updateLoading(loading: boolean) {
    this.setState({
      ...this.state,
      loading,
    });
  }

  // updateChatNotifications(chatNotifications: Notification[]) {
  //   this.setState({
  //     ...this.state,
  //     chatNotifications,
  //   });
  // }

  // updateFeedbackNotifications(feedbackNotifications: Notification[]) {
  //   this.setState({
  //     ...this.state,
  //     feedbackNotifications,
  //   });
  // }

  // updateBookingNotifications(bookingNotifications: Notification[]) {
  //   this.setState({
  //     ...this.state,
  //     bookingNotifications,
  //   });
  // }

  // updateCustomerServiceNotifications(csNotifications: Notification[]) {
  //   this.setState({
  //     ...this.state,
  //     csNotifications,
  //   });
  // }

  // updateConsultNotifications(consultNotifications: Notification[]) {
  //   this.setState({
  //     ...this.state,
  //     consultNotifications,
  //   });
  // }

  // updateCms(cms: boolean) {
  //   this.setState({
  //     ...this.state,
  //     cms,
  //   });
  // }

  // updateCurrentUrl(currentUrl: string) {
  //   this.setState({
  //     ...this.state,
  //     currentUrl,
  //   });
  // }



  // updateBreakpoint(breakpoint: NbMediaBreakpoint) {
  //   this.setState({
  //     ...this.state,
  //     breakpoint,
  //   });
  // }

  // updatePending(pending: Pending) {
  //   this.setState({
  //     ...this.state,
  //     pending,
  //   });
  //   store2.set('pending', pending);
  // }

  reset() {
    this.setState(new AppState());
    // clear localstorage
    clearLocalStorage();
  }
}
