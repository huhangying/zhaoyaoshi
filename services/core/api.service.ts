const baseUrl = 'http://timebox.i234.me/api/';

export const getApi = (path: string) => {
  return fetch(baseUrl + path, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
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

 