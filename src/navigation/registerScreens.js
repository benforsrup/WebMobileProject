// @flow

import React from 'react';
import { Navigation } from 'react-native-navigation';

import {
  LoginScreen,
  ProfileScreen,
  MapScreen,
  BadDetailScreen,
  ListScreen,
  SignUpScreen
} from 'src/screens';


import TopBarBackground from 'src/components/TopBarBackground'
import DetailOverlay from 'src/screens/MapScreen/DetailOverlay'
import { Provider } from 'src/redux';

import {
  LOGIN_SCREEN,
  MAP_SCREEN,
  CUSTOMTOPBAR,
  CUSTOMDETAILOVERLAY,
  BAD_DETAIL_SCREEN,
  LIST_SCREEN,
  PROFILE_SCREEN,
  SIGNUP_SCREEN,
  AUTH_SCREEN,
  FORGOTPASS_SCREEN,
  LOADING_SCREEN
} from './Screens';
import { AuthScreen, ForgotPassScreen, LoadingScreen } from '../screens';

function WrappedComponent(Component, store) {
  const InternalComponent = Component;
  return class Scene extends React.Component {
    constructor(props) {
        super(props);
    }

    static options = { // LINKED HERE
        ...InternalComponent.options,
    };

    render() {
        return (
            <Provider store={store}>
                <InternalComponent
                    ref="child"
                    {...this.props}
                />
            </Provider>
        );
    }
};
 
}

export default function (store) {
  Navigation.registerComponent(AUTH_SCREEN, () => WrappedComponent(AuthScreen, store));
  Navigation.registerComponent(FORGOTPASS_SCREEN, () => WrappedComponent(ForgotPassScreen, store));
  Navigation.registerComponent(LOADING_SCREEN, () => WrappedComponent(LoadingScreen, store))
  Navigation.registerComponent(SIGNUP_SCREEN, () => WrappedComponent(SignUpScreen, store));
  Navigation.registerComponent(LOGIN_SCREEN, () => WrappedComponent(LoginScreen, store));
  Navigation.registerComponent(PROFILE_SCREEN, () => WrappedComponent(ProfileScreen, store));
  Navigation.registerComponent(MAP_SCREEN, () => WrappedComponent(MapScreen, store));
  Navigation.registerComponent(LIST_SCREEN, () => WrappedComponent(ListScreen, store));
  Navigation.registerComponent(BAD_DETAIL_SCREEN, () => WrappedComponent(BadDetailScreen, store));

  //custom components
  Navigation.registerComponent(CUSTOMTOPBAR, () => WrappedComponent(TopBarBackground, store));
  Navigation.registerComponent(CUSTOMDETAILOVERLAY, () => WrappedComponent(DetailOverlay, store));


  console.info('All screens have been registered...');
}
