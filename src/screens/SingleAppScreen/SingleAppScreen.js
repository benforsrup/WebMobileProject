// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { get } from 'lodash';
import Config from 'react-native-config';
import { applyThemeOptions } from '../../styling'
import { pushTutorialScreen } from 'src/navigation';
import { connectData } from 'src/redux';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center'
  }
});

class SingleAppScreen extends React.Component {

  constructor(props) {
    super(props);

    Navigation.events().bindComponent(this);
    console.log(this)
  }

  static get options() {
    
    
    return applyThemeOptions({
      topBar:{
        title:{
          text: 'Home',
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
      <ScrollView>
      <View style={styles.flex}>
        <Text style={{ fontSize: 48, fontWeight: 'bold', color:'green' }}>
          {Config.API_URL}
        </Text>
      </View>
      </ScrollView>
    );
  }
}

SingleAppScreen.propTypes = {
  data: PropTypes.shape({}).isRequired
};

export default connectData()(SingleAppScreen);
