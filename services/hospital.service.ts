import { Hospital } from "../models/hospital/hospital.model";
import { getApi } from "./core/api.service";

export function getHospitalList() {
  return getApi<Hospital[]>('hospitals/app/login');
}
