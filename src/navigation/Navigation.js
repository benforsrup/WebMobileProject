// @flow

import { Navigation } from 'react-native-navigation';
import {StatusBar, Text } from 'react-native'
import {
  MAP_SCREEN,
  LIST_SCREEN,
  PROFILE_SCREEN,
  SIGNUP_SCREEN,
  AUTH_SCREEN,
  FORGOTPASS_SCREEN,
  LOADING_SCREEN
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
            name: SIGNUP_SCREEN,
            options: {
              topBar: {
                visible: false,
              },
              statusBar: {
                style: 'dark'
              }
            }
          }
        },
        {
          component: {
            name: FORGOTPASS_SCREEN,
            options: {
              topBar: {
                visible: false,
              },
              statusBar: {
                style: 'dark'
              }
            }
          }
        },
        {
        component: {
          name: AUTH_SCREEN,
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


export function pushTabBasedApp() {


  Navigation.setDefaultOptions({
    statusBar: {
      style: 'dark'
    },
    topBar:{
      background:{
        translucent: true,
      },
      blur:true,
      drawBehind: true,
    },
    bottomTabs:{
      translucent:true,
      barStyle:'default',
      drawBehind:true,
      selectedTabColor:'green',
      currentTabIndex: 0,
      blur:true,
      

   
    },
    bottomTab:{
      iconColor:'rgba(52, 73, 94, 1)',
      selectedIconColor:'rgba(107, 185, 240, 1)',
      selectedTextColor:'rgba(107, 185, 240, 1)'
    }
    
  });

  Navigation.setRoot({
    root: {
      bottomTabs: {
        children: [{
          stack: {
            children: [{
              component: {
                name: LIST_SCREEN,
                options: {
                  topBar: {
                    visible:false,
                    title: {
                      text: 'TAB 2'
                    },
                  }
                }
              }
            }],
            options: {
              bottomTab: {
                icon: require('assets/icons/ic_search.png'),
                testID: 'SECOND_TAB_BAR_BUTTON',
                text:'Sök'
              }
            }
          },
        },{
          stack: {
            children: [{
              component: {
                name: MAP_SCREEN,
                options: {
                  topBar: {
                    title: {
                      text: 'Badplatser'
                    },
                    visible:false,
                  }
                }
              }
            }],
            options: {
              bottomTab: {
                icon: require('assets/icons/ic_map.png'),
                testID: 'FIRST_TAB_BAR_BUTTON',
                text:'Karta'
              }
            }
          }
        },
        {
          stack: {
            children: [{
              component: {
                name: PROFILE_SCREEN,
              }
            }],
            options: {
              topBar:{
                visible:false
              },
              bottomTab: {
                icon: require('assets/icons/ic_nav_user.png'),
                testID: 'SECOND_TAB_BAR_BUTTON',
                text:'Profil'
              }
            }
          }
        }]
      }
    }
  });
}
