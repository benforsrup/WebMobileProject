// @flow

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  Image,
  Text
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { pushSingleScreenApp, pushTabBasedApp } from 'src/navigation';
import { LOGIN_SCREEN } from 'src/navigation';
import { SFProDisplayMedium } from 'src/fonts';
import firebase from 'react-native-firebase'
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin'
import { Card, Button,Input } from 'react-native-elements';

const {width, height} = Dimensions.get('window');

function wp (percentage) {
  const value = (percentage * width) / 100;
  return Math.round(value);
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  button: {
    backgroundColor: '#039893',
    width: 230,
    marginTop: 0,
    borderRadius: 25
  },
  buttonTitle: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  logo: {
    width: 300,
    height: 220,
    resizeMode: 'contain',
    marginTop: 40,
    marginBottom: 0
  },
  logoTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500'
  },
  inputContainer:{
    paddingHorizontal:10,
    paddingVertical:30,
    width: wp(85),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    backgroundColor:'white',
    justifyContent:'center',
    alignItems:'center'
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

  loginInWithCredentials = () => {
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
  }

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
      <SafeAreaView style={{flex:1}}>
      <View style={styles.flex}>
        <Image
          style={styles.logo}
          source={require('assets/images/logo2.png')}
        />
        <View style={styles.inputContainer}>
        <Input
          placeholder='Mail eller användarnamn'
        />
        <Input
          containerStyle={{marginVertical: 30}}
          placeholder='Lösenord'
        />
        <Button
          onPress={this.loginInWithCredentials}
          title={'Logga in'}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
        </View>
        
        <Text style={{marginVertical: 20}}>
          - eller -
        </Text>

        <Button
          onPress={this.googleLogin}
          title={'Logga in med Google'}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />

      </View>
      </SafeAreaView>
    );
  }
}

export default WelcomeScreen;
