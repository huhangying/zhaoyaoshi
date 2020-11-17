import { getToken } from "./local.store";
import Axios from "axios-observable";
import { EMPTY, from } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { AxiosResponse, AxiosError } from "axios";
Axios.defaults.baseURL = 'http://timebox.i234.me/api/';

// const baseUrl = 'http://timebox.i234.me/api/';

// export const patchApi = (path: string, data: any) => {
//   return fetch(baseUrl + path, {
//     method: 'PATCH',
//     headers: {
//       Accept: 'application/json',
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   }).then((response) => response.json());
// }

// export const getApi = <T>(path: string, params?: any) => {
//   return new Observable(observer => {
//     const abortController = new AbortController();
//     const token$ = from(getToken());
//     const subscription = from(fetch(baseUrl + path, {
//       method: 'GET',
//       headers: {
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${token}`
//       },
//       signal: abortController.signal
//     })).subscribe(observer);

//     return () => {
//       abortController.abort();
//       subscription.unsubscribe();
//     }
//   });
// }


export const getApi = <T>(path: string, params?: any) => {
  return from(getToken()).pipe(
    switchMap(token => {
      return Axios.get<T>(path, {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
    }),
    map((rsp: AxiosResponse<T>) => rsp.data),
    // catchError(error => {
    //   // if (error instanceof AxiosError) {
    //   //   console.log(error);
    //   // }
    //   // throw error;
    //   return EMPTY;
    // })
  );
}

export const patchApi = <T>(path: string, data: any) => {
  return from(getToken()).pipe(
    switchMap(token => {
      return Axios.patch<T>(path, data, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
    }),
    map((rsp: AxiosResponse<T>) => rsp.data),
  );
}

export const postApi = <T>(path: string, data: any) => {
  return from(getToken()).pipe(
    switchMap(token => {
      return Axios.post<T>(path, data, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
    }),
    map((rsp: AxiosResponse<T>) => rsp.data),
  );
}

export const deleteApi = <T>(path: string) => {
  return from(getToken()).pipe(
    switchMap(token => {
      return Axios.delete<T>(path, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
    }),
    map((rsp: AxiosResponse<T>) => rsp.data),
  );
}
