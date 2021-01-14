import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Spinner from './components/shared/Spinner';

import useCachedResources from './hooks/useCachedResources';
import { MainScreen } from './navigation/MainScreen';
import { appStoreReducer } from './services/core/app-store.reducer';

export default function App() {
  const store = createStore(appStoreReducer);
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return (<Spinner />);
  } else {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          {/* <Navigation colorScheme={colorScheme} /> */}
          <MainScreen></MainScreen>
          <StatusBar />
        </SafeAreaProvider>
      </Provider>
    );
  }
}
