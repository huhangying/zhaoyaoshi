import { Auth } from "../../models/auth.model";
import { clearLocalStorage, getDoctor, getToken, setDoctor, setToken } from "./local.store";


export const getAuthState = ()  => {
  // check if in local storage
  return Promise.all([
    getToken(),
    getDoctor()
  ]).then(([token, doctor]) => {
    if (token && doctor) {
      return {
        isLoggedIn: true,
        token,
        doctor,
      } as Auth;
    } else {
      return {
        isLoggedIn: false
      } as Auth;
    }
  })
  .catch(err => ({isLoggedIn: false} as Auth));
}

export const refreshPage = () => {
  window.location.reload();
}

// export const authReducer = (state: Auth, action: any) => {
//   switch (action.type) {
//     // case 'RESTORE_TOKEN':
//     //   return {
//     //     ...state,
//     //     token: action.token,
//     //     doctor: action.doctor,
//     //     isLoading: false,
//     //   };
//     case 'SIGN_IN':
//       return {
//         ...state,
//         isLoggedIn: false,
//         doctor: action.doctor,
//         token: action.token,
//       };
//     case 'SIGN_OUT':
//       return {
//         ...state,
//         isLoggedIn: true,
//         doctor: null,
//         token: null,
//       };
//   }
// }

// export const initAuthData: Auth = {
//   // isLoading: true,
//   isLoggedIn: false,
//   // doctor: null,
//   // token: null,
// };

// export const authMethods = () => {
//   const [state, dispatch] = React.useReducer(authReducer, initAuthData);
//   return {
//     signIn: async (data: { username: string, password: string }) => {
//       // In a production app, we need to send some data (usually username, password) to server and get a token
//       // We will also need to handle errors if sign in failed
//       // After getting token, we need to persist the token using `AsyncStorage`
//       // In the example, we'll use a dummy token
//       doctorLogin(data.username, data.password)
//         .then(result => {
//           if (result?.return) {
//             // setHasError(true);
//             // setErrorMessage('用户名或者密码错误。');
//             return;
//           }
//           setToken(result.token);
//           delete result.token;
//           setDoctor(result);
//         })
//         .catch(err => {
//           // setHasError(true);
//           // setErrorMessage('用户名或者密码错误。');
//         });

//       dispatch({ type: 'SIGN_IN', token: getToken(), doctor: getDoctor() });
//     },
//     signOut: () => dispatch({ type: 'SIGN_OUT' }),
//   };
// }

// export const authContext = React.useMemo(authMethods, []);