// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert, TouchableOpacity
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { get } from 'lodash';
import Config from 'react-native-config';
import { applyThemeOptions } from '../../styling'
import { pushTutorialScreen } from 'src/navigation';
import { connectData } from 'src/redux';
import firebase from 'react-native-firebase'
import { GoogleSignin } from 'react-native-google-signin'
import * as _ from 'lodash'
const styles = StyleSheet.create({
  flex: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center'
  }
});

class ProfileScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user:""
    }
    Navigation.events().bindComponent(this);
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
  componentDidMount(){
  //  console.log(firebase.auth().currentUser.toJSON())
   if(firebase.auth().currentUser.toJSON()){
     this.setState({user: firebase.auth().currentUser.toJSON()})
   }
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

  signOut = () => {
    // console.log(firebase.auth().currentUser.toJSON())
    firebase.auth().signOut().then( async() => {
      
      const isSignedInToGoogle = await GoogleSignin.isSignedIn()
      // console.log(isSignedInToGoogle)
      if(isSignedInToGoogle){
        try {
          await GoogleSignin.revokeAccess();
          await GoogleSignin.signOut();
          this.setState({ user: null });
          pushTutorialScreen()
        } catch (error) {
          console.log(error)
        }
      }
      else{
        pushTutorialScreen()
      }
      
    }).catch(error => {
      console.log(error)
    })
  }

  render() {
    return (
      <ScrollView>
      <View style={styles.flex}>
      {!_.isEmpty(this.state.user) && <Text>{this.state.user.displayName}</Text>}
      <TouchableOpacity onPress={this.signOut}>
        <Text> Sign out</Text>
      </TouchableOpacity>
      </View>
      </ScrollView>
    );
  }
}


export default connectData()(ProfileScreen);
