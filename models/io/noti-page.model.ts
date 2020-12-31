import { NotificationType } from "./notification.model";

export interface NotiPage {
  patientId: string;
  type: NotificationType;
  doctorId?: string;
}
