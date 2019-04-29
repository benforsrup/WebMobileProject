// @flow

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  Image,
  Text,
  TouchableOpacity
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { pushTabBasedApp } from 'src/navigation';
import firebase from 'react-native-firebase'
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin'
import { Card, Button,Input } from 'react-native-elements';
import { SIGNUP_SCREEN, FORGOTPASS_SCREEN } from '../../navigation';

const {width, height} = Dimensions.get('window');

function wp (percentage) {
  const value = (percentage * width) / 100;
  return Math.round(value);
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: "rgb(245, 245, 245)"
  },
  button: {
    backgroundColor: 'rgba(96, 166, 216, 1)',
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
    height: 200,
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
    shadowColor: "rgba(96, 166, 216, 1)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    backgroundColor: "rgba(255, 255, 255, 1)",
    justifyContent:'center',
    alignItems:'center'
  }
});

class AuthScreen extends PureComponent {

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

    // try {
    //   //Assign the promise unresolved first then get the data using the json method. 
    //   const badplatserApiCall = await fetch('https://badplatsen.havochvatten.se/badplatsen/api/feature/');
    //   const badplatser = await badplatserApiCall.json()
    //   badplatser.features.slice(100,105).forEach( async(feature) => {
    //     try {
    //       const id = feature.properties.NUTSKOD
    //       const badplatsdetailApiCall = await fetch('https://badplatsen.havochvatten.se/badplatsen/api/testlocationprofile/' + id );
    //       const baddetail = await badplatsdetailApiCall.json()
    //       console.log(feature, baddetail)
    //     }catch(error){

    //     }
    //   })
    // } catch(error) {
    //   console.log(error)
    // }
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
  signUp = () => {
    Navigation.push(this.props.componentId,{
      component:{
        name: SIGNUP_SCREEN,
        options:{
          topBar:{
            visible: false,
            noBorder: true,
            background: { color: 'transparent' },
          },
          statusBar:{
            style:'dark'
          }
        }
      }
    })
  }

  forgotPass = () => {
    Navigation.push(this.props.componentId,{
      component:{
        name: FORGOTPASS_SCREEN,
        options:{
          topBar:{
            visible: false,
            noBorder: true,
            background: { color: 'transparent' },
          },
          statusBar:{
            style:'dark'
          }
        }
      }
    })
  }

  render() {
    return (
      <SafeAreaView style={{flex:1, backgroundColor: "rgb(245, 245, 245)"}}>
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

        <View style={{marginTop:0, flex: 1, justifyContent:'center', alignItems:'center'}}>
         
          <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
          <Text style={{marginVertical:10}}> Har du inget konto?</Text>
          <TouchableOpacity onPress={this.signUp}><Text style={{color:'rgba(96, 166, 216, 1)', fontWeight:'bold'}}>  Skapa ett här</Text></TouchableOpacity>
          </View>
        </View>

      </View>
      </SafeAreaView>
    );
  }
}

export default AuthScreen;
