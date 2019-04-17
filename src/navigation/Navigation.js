// @flow

import { Navigation } from 'react-native-navigation';
import {StatusBar } from 'react-native'
import {
  WELCOME_SCREEN,
  SINGLE_APP_SCREEN,
  MAP_SCREEN,
  TAB1_SCREEN,
  TAB2_SCREEN
} from './Screens';
import registerScreens from './registerScreens';
import store from '../redux/store'
// Register all screens on launch
registerScreens(store);

export function pushTutorialScreen() {

  Navigation.setDefaultOptions({
    statusBar: {
      style: 'light'
    },
    
  });

  Navigation.setRoot({
    root: {
      stack: {
        children: [{
          component: {
            name: WELCOME_SCREEN,
            options: {
              topBar: {
                visible: false,
              },
              statusBar: {
                style: 'dark'
              }
            }
          }
        }]
      }
    }
  });
}

export function pushSingleScreenApp() {
  console.disableYellowBox = true;
  Navigation.setRoot({
    root: {
      stack: {
        children: [{
          component: {
            name: MAP_SCREEN,
            options: {
              topBar: {
                
                // leftButtons: [
                //   {
                //     id: 'nav_user_btn',
                //     // icon: require('assets/icons/ic_nav_user.png'),
                //     color: 'black',
                //     systemItem: 'back'
                //   }
                // ],
                // rightButtons: [
                //   {
                //     id: 'nav_logout_btn',
                //     icon: require('assets/icons/ic_nav_logout.png'),
                //     color: 'black'
                //   }
                // ]
              }
            }
          }
        }]
      }
    }
  });
}

export function pushTabBasedApp() {
  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [{
          stack: {
            children: [{
              component: {
                name: TAB1_SCREEN,
                options: {
                  topBar: {
                    title: {
                      text: 'TAB 1'
                    },
                    leftButtons: [
                      {
                        id: 'nav_user_btn',
                        icon: require('assets/icons/ic_nav_user.png'),
                        color: 'white'
                      }
                    ],
                    rightButtons: [
                      {
                        id: 'nav_logout_btn',
                        icon: require('assets/icons/ic_nav_logout.png'),
                        color: 'white'
                      }
                    ]
                  }
                }
              }
            }],
            options: {
              bottomTab: {
                icon: require('assets/icons/ic_tab_home.png'),
                testID: 'FIRST_TAB_BAR_BUTTON',
                text: 'Tab1',
              }
            }
          }
        },
        {
          stack: {
            children: [{
              component: {
                name: TAB2_SCREEN,
                options: {
                  topBar: {
                    title: {
                      text: 'TAB 2'
                    },
                    leftButtons: [
                      {
                        id: 'nav_user_btn',
                        icon: require('assets/icons/ic_nav_user.png'),
                        color: 'white'
                      }
                    ],
                    rightButtons: [
                      {
                        id: 'nav_logout_btn',
                        icon: require('assets/icons/ic_nav_logout.png'),
                        color: 'white'
                      }
                    ]
                  }
                }
              }
            }],
            options: {
              bottomTab: {
                icon: require('assets/icons/ic_tab_menu.png'),
                testID: 'SECOND_TAB_BAR_BUTTON',
                text: 'Tab2',
              }
            }
          }
        }]
      }
    }
  });
}
