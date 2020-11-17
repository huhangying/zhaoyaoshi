import { Doctor } from "./crm/doctor.model";
import { Notification } from "./io/notification.model";

export class AppState {
  constructor(
    public readonly doctor?: Doctor,
    public readonly token?: string,

    public readonly loading?: boolean,
    public readonly chatNotifications?: Notification[],
    public readonly feedbackNotifications?: Notification[],
    public readonly consultNotifications?: Notification[],
  ) { }
}