// @flow

import React from 'react';
import { Navigation } from 'react-native-navigation';

import {
  WelcomeScreen,
  LoginScreen,
  SingleAppScreen,
  Tab2Screen,
  MapScreen
} from 'src/screens';


import TopBarBackground from 'src/components/TopBarBackground'

import { Provider } from 'src/redux';

import {
  WELCOME_SCREEN,
  LOGIN_SCREEN,
  SINGLE_APP_SCREEN,
  TAB2_SCREEN,
  MAP_SCREEN,
  CUSTOMTOPBAR
} from './Screens';

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
  Navigation.registerComponent(WELCOME_SCREEN, () => WrappedComponent(WelcomeScreen, store));
  Navigation.registerComponent(LOGIN_SCREEN, () => WrappedComponent(LoginScreen, store));
  Navigation.registerComponent(SINGLE_APP_SCREEN, () => WrappedComponent(SingleAppScreen, store));
  Navigation.registerComponent(MAP_SCREEN, () => WrappedComponent(MapScreen, store));
  Navigation.registerComponent(TAB2_SCREEN, () => WrappedComponent(Tab2Screen, store));

  //custom components
  Navigation.registerComponent(CUSTOMTOPBAR, () => WrappedComponent(TopBarBackground, store));


  console.info('All screens have been registered...');
}
