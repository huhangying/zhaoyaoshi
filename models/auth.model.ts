import { Doctor } from "./crm/doctor.model";

export interface Auth {
  isLoggedIn: boolean;
  doctor?: Doctor;
  token?: string;
}