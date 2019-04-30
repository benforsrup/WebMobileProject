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

  constructor(props){
    super(props)
    this.state ={
      email:"",
      password:""
    }
    this.firestoreref = firebase.firestore().collection('badfeature');
  }

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
    const user = firebase.auth().currentUser
    if(user){
      console.log(user.toJSON())
    }

    // try {
    //   //Assign the promise unresolved first then get the data using the json method. 
    //   const badplatserApiCall = await fetch('https://badplatsen.havochvatten.se/badplatsen/api/feature/');
    //   const badplatser = await badplatserApiCall.json()
    //   badplatser.features.forEach( async(feature) => {
    //     try {
    //       const id = feature.properties.NUTSKOD
    //       const badplatsdetailApiCall = await fetch('https://badplatsen.havochvatten.se/badplatsen/api/testlocationprofile/' + id );
    //       const baddetail = await badplatsdetailApiCall.json()
    //       console.log(feature, baddetail)
    //       let object = {
    //         feature,
    //         baddetail
    //       }
    //       this.firestoreref.add({object})
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


  checkGoogleSign = async() => {
    const isSignedInToGoogle = await GoogleSignin.isSignedIn()
    if(isSignedInToGoogle){
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      } catch (error) {
        console.log(error)
      }
    }
  }

  loginInWithCredentials = async() => {
    const { email, password } = this.state
    await this.checkGoogleSign()//first check that googlesignout is confirmed
    if(email.length > 0 && password.length > 0){
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user)=> {
          console.log(user)
          pushTabBasedApp()
        })
    }
    else{
      //show error

    }
  }

  render() {
    return (
      <SafeAreaView style={{flex:1, backgroundColor: "rgb(245, 245, 245)"}}>
      <View style={styles.flex}>
        <Text style={{marginVertical: 60, fontSize: 90, fontWeight:'bold'}}>
        🏊‍
        </Text>
        <View style={styles.inputContainer}>
        <Input
          onChangeText={(text) => this.setState({email:text})}
          placeholder='Mail eller användarnamn'
          autoCapitalize='none'
          keyboardType='email-address'
        />
        <Input
          onChangeText={(text) => this.setState({password:text})}
          containerStyle={{marginVertical: 30}}
          placeholder='Lösenord'
          secureTextEntry={true}
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