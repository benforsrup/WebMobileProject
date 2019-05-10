// @flow

import React, { PureComponent } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { pushTabBasedApp } from 'src/navigation';
import firebase from 'react-native-firebase'
import { GoogleSignin, GoogleSigninButton } from 'react-native-google-signin'
import { Card, Button,Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { addUserToFirestore } from '../../services/firebaseService';

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
  back: {
    position: "absolute",
    top: 8,
    left: 16,
    zIndex: 1
  },
  button: {
    backgroundColor: 'rgba(96, 166, 216, 1)',
    width: 220,
    marginBottom: 40,
    borderRadius: 25
  },
  buttonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily:'ProductSans-Regular'
  },
  logo: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    marginTop: 0,
    marginBottom: 0
  },
  logoTitle: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500'
  },
  inputContainer:{
    width: wp(85),
    justifyContent:'space-evenly',
    alignItems:'center',
    padding:0,
    flex: 1,
  }
});

class SignUpScreen extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      user:{
        name:"",
        email:"",
        password:"",
        passwordConfirm:""
      }
    }
  }

  goBack = () => {
    Navigation.pop(this.props.componentId)
  }

  createWithWithCredentials = () => {
    const { user } = this.state
    //need more validation
    if(user.password === user.passwordConfirm){
      console.log(user)
      firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(userCredentials => {
        console.log(user)
        if(userCredentials.user){
          userCredentials.user.updateProfile({
            displayName: user.name
          }).then(() => {
            addUserToFirestore().then(() => pushTabBasedApp())  
          })

        }
        
      })
      .catch(error => this.setState({ errorMessage: error.message }))
    }
    // firebase
    //   .auth()
    //   .createUserWithEmailAndPassword(email, password)
    //   .then(user => this.props.navigation.navigate('Main'))
    //   .catch(error => this.setState({ errorMessage: error.message }))
  }
  

  render() {
    const { user } = this.state
    return (
      <SafeAreaView style={{flex:1, backgroundColor: "rgb(245, 245, 245)"}}>
        <View style={styles.flex}>
          
          <KeyboardAvoidingView behavior="padding" style={styles.inputContainer} enabled>
          <Text style={{marginVertical: 60, fontSize: 30, fontWeight:'bold', fontFamily:'ProductSans-Regular'}}>
        Skapa ett konto 😊
        </Text>
          <Input
            inputStyle={{fontFamily:'ProductSans-Regular'}}
            value={user.name}
            onChangeText={(text) => this.setState({user:{
              ...this.state.user,
              name: text
            }})}
            containerStyle={{marginBottom: 30}}
            placeholder='Namn'
          />
          <Input
          inputStyle={{fontFamily:'ProductSans-Regular'}}
          onChangeText={(e) => this.setState({user:{
            ...this.state.user,
            email: e
          }})}
          value={user.email}
            containerStyle={{marginBottom: 30}}
            placeholder='Email'
            keyboardType='email-address'
            autoCapitalize='none'
          />
          <Input
          inputStyle={{fontFamily:'ProductSans-Regular'}}
          onChangeText={(e) => this.setState({user:{
            ...this.state.user,
            password: e
          }})}
          value={user.password}
            containerStyle={{marginBottom: 30}}
            placeholder='Lösenord'
            secureTextEntry={true}
          />
          <Input
          inputStyle={{fontFamily:'ProductSans-Regular'}}
          onChangeText={(e) => this.setState({user:{
            ...this.state.user,
            passwordConfirm: e
          }})}
            value={user.passwordConfirm}
            secureTextEntry={true}

            containerStyle={{marginBottom: 15}}
            placeholder='Bekräfta lösenord'
          />
          <View style={{height:60}} />
          <Button
          onPress={this.createWithWithCredentials}
          title={'Skapa konto'}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />
          </KeyboardAvoidingView>
        

        <TouchableOpacity onPress={this.goBack} style={styles.back}>
          <Icon  name="chevron-left" size={27} color="#4A4A4A" />
        </TouchableOpacity>
       
        </View>
      </SafeAreaView>
    );
  }
}

export default SignUpScreen;
