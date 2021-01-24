import { AppSettings } from "./app-settings.model";
import { Doctor } from "./crm/doctor.model";
import { Hospital } from "./hospital/hospital.model";

export interface Auth {
  hospital?: Hospital;
  doctor?: Doctor;
  token?: string;
  appSettings?: AppSettings;
}