import { Hospital } from "../models/hospital/hospital.model";
import { AdviseTemplate } from "../models/survey/advise-template.model";
import { Advise } from "../models/survey/advise.model";
import { getApi, postApi } from "./core/api.service";

export function getHospitalList() {
  return getApi<Hospital[]>('hospitals/app/login');
}

export function getAdviseTemplatesByDepartmentId(department: string) {
  return getApi<AdviseTemplate[]>(`advisetemplates/department/${department}`); // department 'none' is for hospital-level
}

export function createAdvise(data: Advise) {
  return postApi<Advise>('advise', data);
}

