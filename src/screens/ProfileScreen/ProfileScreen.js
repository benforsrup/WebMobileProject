// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Dimensions,
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
import { Avatar, Button } from 'react-native-elements';
import { connect } from 'react-redux';

const { width, height } = Dimensions.get('window');

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
   if(firebase.auth().currentUser){
     this.setState({user: firebase.auth().currentUser.toJSON()})
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
    const { userProps }  = this.props
    let numOfFavorites = null;
    let favoriteText = null
    if(userProps){
      numOfFavorites = userProps.favorites.length
      if(numOfFavorites == 1){
        favoriteText = "favorit"
      }
      else{
        favoriteText = "favoriter"
      }
    }
    return (
      <ScrollView >
      <View style={styles.flex}>
      {/* {!_.isEmpty(this.state.user) && <Text>{this.state.user.displayName}</Text>} */}
      
      <View style={styles.profileBackground} >
      <Avatar
        size="xlarge"
        rounded
        avatarStyle={{backgroundColor:'rgba(107, 185, 240, 1)'}}
        containerStyle={styles.avatarStyle}
        title={this.state.user.displayName ? (this.state.user.displayName).match(/\b(\w)/g).join(''): ""}
        onPress={() => console.log("Works!")}
        activeOpacity={0.7}
      />
      </View>
      <View style={styles.informationContainer}>

      <Text style={styles.nameStyle}> {this.state.user.displayName} </Text>
      {numOfFavorites > 0 && <View>
        <Text> Du har <Text style={styles.favStyle}>{numOfFavorites}</Text> {favoriteText} </Text>
      </View>}
      <Button
            
            buttonStyle={{backgroundColor:'rgba(107, 185, 240, 1)'}}
            onPress={this.signOut}
            title={'Logga ut'}
          />
      </View>
      </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  favStyle:{
    fontWeight: 'bold'
  },
  avatarStyle:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.20,
    shadowRadius: 1.41,

    elevation: 2,
  },
  profileBackground: {
    width:width,
    height: 200,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'white'
  },
  informationContainer:{
    width:width,
    alignItems:'center'
  },
  nameStyle:{
    marginVertical:20,
    fontSize: 20,
    fontWeight: 'bold'
  }
});


const mapStateToProps = (state) => {
  const { user } = state
  return  {
    userProps:user
    
  }
}

export default connect(mapStateToProps, null)(ProfileScreen);
