// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  Alert
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { get } from 'lodash';
import Map from '../../components/map/Map'
import { pushTutorialScreen } from 'src/navigation';
import { connectData } from 'src/redux';
import { applyThemeOptions } from '../../styling'
const styles = StyleSheet.create({
  flex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
    justifyContent: "flex-end"
  }
});

class Tab1Screen extends PureComponent {

  constructor(props) {
    super(props);

    Navigation.events().bindComponent(this);
  }

  static get options() { 
    return applyThemeOptions({
      statusBar:{
        backgroundColor: 'blue'
      },
      topBar:{
        noBorder:true,
        title:{
          component: {
            name: 'custom.TopBarBackground',
            alignment: 'fill'
          }
        },
        
        
      },
      
    });
  }

  navigationButtonPressed({ buttonId }) {
    const { data } = this.props;

    switch (buttonId) {
      case 'nav_logout_btn': {
        pushTutorialScreen();
        break;
      }
      case 'nav_user_btn': {
        Alert.alert(get(data, 'user.name', 'Unknown User'));
        break;
      }
      default:
        break;
    }
  }

  render() {
    return (
      <View style={styles.container}>
          <Map />
      </View>
    );
  }
}

Tab1Screen.propTypes = {
  data: PropTypes.shape({}).isRequired
};

export default connectData()(Tab1Screen);
