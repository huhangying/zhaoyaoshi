import { getToken } from "./local.store";

const baseUrl = 'http://timebox.i234.me/api/';

export const getApi = async (path: string) => {
  const token = await getToken();
  return fetch(baseUrl + path, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
  }).then((response) => response.json());
}

export const patchApi = (path: string, data: any) => {
  return fetch(baseUrl + path, {
    method: 'PATCH',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((response) => response.json());
}

 