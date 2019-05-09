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
import Icon from 'react-native-vector-icons/FontAwesome';

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
    marginTop: 0,
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
    marginBottom: 40,
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

class ForgotPassScreen extends PureComponent {

  goBack = () => {
    Navigation.pop(this.props.componentId)
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
          containerStyle={{marginBottom: 30}}
          placeholder='Namn'
        />
        <Input
          containerStyle={{marginBottom: 30}}
          placeholder='Email'
        />
        <Input
          containerStyle={{marginBottom: 30}}
          placeholder='Lösenord'
        />
        <Input
          containerStyle={{marginBottom: 15}}
          placeholder='Bekräfta lösenord'
        />
        
        </View>
      <Button
          onPress={this.loginInWithCredentials}
          title={'Skapa konto'}
          buttonStyle={styles.button}
          titleStyle={styles.buttonTitle}
        />

        <TouchableOpacity onPress={this.goBack} style={styles.back}>
          <Icon  name="chevron-left" size={27} color="#4A4A4A" />
        </TouchableOpacity>

      </View>
      </SafeAreaView>
    );
  }
}

export default ForgotPassScreen;
