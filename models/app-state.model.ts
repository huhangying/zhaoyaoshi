import { SocketioService } from "../services/core/socketio.service";
import { AppSettings, Toaster } from "./app-settings.model";
import { Doctor } from "./crm/doctor.model";
import { NotiPage } from "./io/noti-page.model";
import { Notification } from "./io/notification.model";

export class AppState {
  constructor(
    // local storage
    public readonly doctor?: Doctor,
    public readonly token?: string,
    public readonly appSettings?: AppSettings,
    
    public readonly isLoggedIn?: boolean,
    public readonly loading?: boolean,
    public readonly errorMessage?: string,
    public readonly snackbar?: Toaster,

    public readonly chatNotifications?: Notification[],
    public readonly feedbackNotifications?: Notification[],
    public readonly consultNotifications?: Notification[],

    public readonly hideBottomBar?: boolean,
    public readonly ioService?: SocketioService,

    public readonly notiPage?: NotiPage,
  ) { }
}