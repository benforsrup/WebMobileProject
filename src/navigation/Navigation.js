// @flow

import { Navigation } from 'react-native-navigation';
import {StatusBar } from 'react-native'
import {
  WELCOME_SCREEN,
  MAP_SCREEN,
  LIST_SCREEN,
  PROFILE_SCREEN
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
      // translucent:true,
      barStyle:'default',
      // drawBehind:true,
      selectedTabColor:'green',
      backgroundColor:'rgba(107, 185, 240, 1)',
      currentTabIndex: 0
   
    },
    bottomTab:{
      iconColor:'rgba(52, 73, 94, 1)',
      selectedIconColor:'white',
      selectedTextColor:'white'
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
                    leftButtons: [
                      {
                        id: 'nav_user_btn',
                        icon: require('assets/icons/ic_nav_user.png'),
                        color: 'black'
                      }
                    ],
                    rightButtons: [
                      {
                        id: 'nav_logout_btn',
                        icon: require('assets/icons/ic_nav_logout.png'),
                        color: 'black'
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
                selectedTextColor:'white'
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

                    leftButtons: [
                      {
                        id: 'nav_user_btn',
                        icon: require('assets/icons/ic_nav_user.png'),
                        color: 'black'
                      }
                    ],
                    rightButtons: [
                      {
                        id: 'nav_logout_btn',
                        icon: require('assets/icons/ic_nav_logout.png'),
                        color: 'black'
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
              bottomTab: {
                icon: require('assets/icons/ic_nav_user.png'),
                testID: 'SECOND_TAB_BAR_BUTTON',
              }
            }
          }
        }]
      }
    }
  });
}
