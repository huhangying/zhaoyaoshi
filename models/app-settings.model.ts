
export interface AppSettings {
  enableVibrate?: boolean;
}

export interface Toaster {
  type: MessageType;
  msg: string;
}

export enum MessageType {
  info = 0,
  warn = 1,
  success = 2,
  error = 3,
}