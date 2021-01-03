import { SocketioService } from "../services/core/socketio.service";
import { Doctor } from "./crm/doctor.model";
import { NotiPage } from "./io/noti-page.model";
import { Notification } from "./io/notification.model";

export class AppState {
  constructor(
    public readonly doctor?: Doctor,
    public readonly token?: string,
    public readonly isLoggedIn?: boolean,

    public readonly loading?: boolean,
    public readonly errorMessage?: string,
    public readonly snackbar?: string,

    public readonly chatNotifications?: Notification[],
    public readonly feedbackNotifications?: Notification[],
    public readonly consultNotifications?: Notification[],

    public readonly hideBottomBar?: boolean,
    public readonly ioService?: SocketioService,

    public readonly notiPage?: NotiPage,
  ) { }
}