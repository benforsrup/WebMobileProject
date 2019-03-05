import { Platform, StyleSheet, StatusBar } from 'react-native';
import set from 'lodash/set';

const getStatusBarStyle = (backgroundColor) => {
    const result = /^#?([a-f\d]{1,2})([a-f\d]{1,2})([a-f\d]{1,2})$/i.exec(backgroundColor);
    if (!result) return 'light-content';
    const [r, g, b] = result.slice(1, 4).map(n => parseInt(n.length === 1 ? `f${n}` : n, 16));
    const shade = (r + g + b) / 3;
    return shade > 128 ? 'dark-content' : 'light-content';
  };

export const applyThemeOptions = (settings) => {
    if (Platform.OS === 'ios') {
        console.log('StatusBar.translucent:', StatusBar.translucent);
      // NavBar
    //   const navBarStyle = 'dark';
    //   const navBarBg = 'transparent';
  
    //   if (navBarBg && navBarBg !== 'transparent') {
    //     StatusBar.setBarStyle(getStatusBarStyle(navBarBg));
    //   } else {
    //     StatusBar.setBarStyle(navBarStyle === 'dark' ? 'light-content' : 'dark-content');
    //   }
  
      // Top Bar
      set(settings, 'topBar.drawBehind', true);
      set(settings, 'topBar.background.translucent', true);
      set(settings, 'topBar.background.blur', false);
      set(settings, 'topBar.background.color', ' transparent');
      set(settings, 'topBar.barStyle', 'default');
      set(settings, 'topBar.title.color', 'black');
      set(settings, 'topBar.buttonColor', '007aff');
      set(settings, 'statusBar.style', 'light')
  
  
      set(settings, 'layout.backgroundColor', '007aff');
    }
    console.log(settings)
    return settings;
}