import { Doctor } from "./crm/doctor.model";
import { Hospital } from "./hospital/hospital.model";

export interface Auth {
  isLoggedIn: boolean;
  hospital?: Hospital;
  doctor?: Doctor;
  token?: string;
}