import { Auth } from "./auth.model";
import { Doctor } from "./crm/doctor.model";

// export interface AppState {
//   auth?: Auth;
//   count?: number; // test
// }

export class AppState {
  constructor(
    public readonly auth?: Auth,
    public readonly count?: number,

    public readonly doctor?: Doctor,
    public readonly token?: string,
    // public readonly hid?: number,
    // public readonly currentUrl?: string,
    // public readonly cms?: boolean,
    public readonly loading?: boolean,
    // public readonly breakpoint?: NbMediaBreakpoint,
    // public readonly chatNotifications?: Notification[],
    // public readonly feedbackNotifications?: Notification[],
    // public readonly bookingNotifications?: Notification[],
    // public readonly csNotifications?: Notification[],
    // public readonly consultNotifications?: Notification[],
    // public readonly pending?: Pending,
  ) { }
}