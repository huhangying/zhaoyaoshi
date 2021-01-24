import React, { useEffect } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import useColorScheme from '../hooks/useColorScheme';
import { AppState } from '../models/app-state.model';
import Navigation from '../navigation';
import SignInScreen from '../screens/SignInScreen';
import {
  updateChatNotifications, updateConsultNotifications, updateDoctor, updateFeedbackNotifications,
  updateIsLoggedIn, updateNotiPage, updateToken, updateSnackbar, updateAppSettings
} from '../services/core/app-store.actions';
import { getAuthState } from '../services/core/auth';

export function MainScreen() {
  const colorScheme = useColorScheme();
  const dispatch = useDispatch()
  const isLoggedIn = useSelector((state: AppState) => state.isLoggedIn);

  useEffect(() => {
    // const _auth = await getAuthState();
    getAuthState().then(_auth => {
      if (_auth?.doctor?._id) {
        dispatch(updateDoctor(_auth.doctor));
        dispatch(updateToken(_auth.token));
        dispatch(updateAppSettings(_auth.appSettings || {}));
      }
    });
  }, [dispatch]);

  return (
    <>
      {(!isLoggedIn) ?
        (
          <SignInScreen></SignInScreen>
        )
        :
        (
          <Navigation colorScheme={colorScheme} />
        )
      }
    </>
  );

}

const mapState = (state: AppState) => {
  return {
    doctor: state.doctor,
    token: state.token,
    appSettings: state.appSettings,
    isLoggedIn: state.isLoggedIn,
    notiPage: state.notiPage,
    snackbar: state.snackbar,
    chatNotifications: state.chatNotifications,
    feedbackNotifications: state.feedbackNotifications,
    consultNotifications: state.consultNotifications,
  }
}

const mapDispatch = {
  updateDoctor,
  updateToken,
  updateAppSettings,
  updateIsLoggedIn,
  updateNotiPage,
  updateSnackbar,
  updateChatNotifications,
  updateFeedbackNotifications,
  updateConsultNotifications,
}
export default connect(mapState, mapDispatch)(MainScreen);