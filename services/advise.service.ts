import { AdviseTemplate } from "../models/survey/advise-template.model";
import { Advise } from "../models/survey/advise.model";
import { getApi, postApi } from "./core/api.service";


export function getAdviseTemplatesByDepartmentId(department: string) {
  return getApi<AdviseTemplate[]>(`advisetemplates/department/${department}`); // department 'none' is for hospital-level
}

export function createAdvise(data: Advise) {
  return postApi<Advise>('advise', data);
}

export function geUserAdviseHistory(userId: string) {
  return getApi<Advise[]>(`advises/user-history/${userId}`);
}