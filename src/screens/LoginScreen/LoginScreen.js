// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Alert
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { LoginManager, AccessToken } from 'react-native-fbsdk';
import { connectData } from 'src/redux';
import { pushSingleScreenApp, pushTabBasedApp } from 'src/navigation';
import firebase from 'react-native-firebase';

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#039893'
  }
});

class LoginScreen extends React.Component {
  constructor(props){
    super(props);
    // console.log(this)
  }
 
  loginWithFacebook = () => {
    firebase.auth()
    .signInAnonymously()
    .then(credential => {
      if (credential) {
        // console.log('default app user ->', credential.user.toJSON());
        pushTabBasedApp()
      }
    });
  };

  render() {
    return (
      <View style={styles.flex}>
        <FontAwesome5.Button
          solid
          name={'facebook'}
          style={styles.button}
          onPress={this.loginWithFacebook}
        >
          Login with Facsdasdaebook
        </FontAwesome5.Button>
      </View>
    );
  }
}

LoginScreen.propTypes = {
  getFacebookUserData: PropTypes.func.isRequired,
  screenType: PropTypes.oneOf(['Single', 'Tab']).isRequired
};

export default connectData()(LoginScreen);
