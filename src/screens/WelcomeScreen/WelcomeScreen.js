// @flow

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  Image
} from 'react-native';
import { Button } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';
import { pushSingleScreenApp, pushTabBasedApp } from 'src/navigation';
import { LOGIN_SCREEN } from 'src/navigation';
import { SFProDisplayMedium } from 'src/fonts';
import firebase from 'react-native-firebase'
import { GoogleSignin } from 'react-native-google-signin'
const styles = StyleSheet.create({
  flex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#039893',
    width: 230,
    marginTop: 30,
    borderRadius: 25
  },
  buttonTitle: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  logo: {
    width: 300,
    height: 120,
    resizeMode: 'contain'
  },
  logoTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500'
  }
});

class WelcomeScreen extends PureComponent {

  handleGetStartAction = (screenType) => {
    firebase.auth()
    .signInAnonymously()
    .then(credential => {
      if (credential) {
        // console.log('default app user ->', credential.user.toJSON());
        pushTabBasedApp()
      }

    }).catch(error=>{
      // console.log(error, "comeon")
    })
    // Navigation.push(this.props.componentId, {
    //   component: {
    //     name: LOGIN_SCREEN,
    //     passProps: {
    //       screenType
    //     },
    //     options: {
    //       topBar: {
    //         title: {
    //           text: 'LOGIN'
    //         }
    //       }
    //     }
    //   }
    // });
  };

  async componentDidMount(){
    const a = await GoogleSignin.isSignedIn()
    console.log("isSignedIn: ", a)
  }

  // Calling this function will open Google for login.
  googleLogin = async () => {
    try {
      // add any configuration settings here:
      await GoogleSignin.configure();
      
      const data = await GoogleSignin.signIn();
  
      // create a new firebase credential with the token
      const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken)
      // login with credential
      const firebaseUserCredential = await firebase.auth().signInWithCredential(credential);
      if(firebaseUserCredential){
        pushTabBasedApp()
      }
      
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    return (
      <View style={styles.flex}>
        <Image
          style={styles.logo}
          source={require('assets/images/logo.png')}
        />
        <SFProDisplayMedium style={styles.logoTitle}>
          {'Welcome to RNN v2 Starter Kit!'}
        </SFProDisplayMedium>
        <Button
          onPress={this.googleLogin}
          title={'Start Single Screen App'}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
        <Button
          onPress={() => this.handleGetStartAction('Tab')}
          title={'Start Tab Based App'}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
      </View>
    );
  }
}

export default WelcomeScreen;
