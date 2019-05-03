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
import { Card, Button,Input } from 'react-native-elements';
import { AUTH_SCREEN } from '../../navigation';

const {width, height} = Dimensions.get('window');

function wp (percentage) {
  const value = (percentage * width) / 100;
  return Math.round(value);
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "rgb(245, 245, 245)"
  },
});

class LoadingScreen extends PureComponent {

  constructor(props){
    super(props)
    this.state ={
      email:"",
      password:""
    }
  }

  componentDidMount(){
    const user = firebase.auth().currentUser
    if(user){
      // pushTabBasedApp()
    }
    else{
      // console.log("should go to auth", this.props.componentId)
      // Navigation.push(this.props.compententId, {
      //   component:{
      //     name:AUTH_SCREEN,
      //     options:{
      //       topBar:{
      //         visible:false
      //       }
      //     }
      //   }
      // })
    }

  }

  render() {
    return (
      <SafeAreaView style={{flex:1, backgroundColor: "rgb(245, 245, 245)"}}>
      <View style={styles.flex}>
        
      <Button
        title="Loading button"
        loading
        type='clear'
      />

      </View>
      </SafeAreaView>
    );
  }
}

export default LoadingScreen;
