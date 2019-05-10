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
import { applyThemeOptions } from '../../styling'
import { pushTutorialScreen } from 'src/navigation';
import firebase from 'react-native-firebase'
import { GoogleSignin } from 'react-native-google-signin'
import * as _ from 'lodash'
import { Avatar, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

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
    let numOfFavorites = 0;
    let numOfUpvotes = 0;
    let favoriteText = "favoriter"
    let upvoteText = "badplatser"
    if(userProps){
      numOfFavorites = userProps.favorites.length
      numOfUpvotes = userProps.upvoted.length
      if(numOfFavorites == 1){
        favoriteText = "favorit"
      }
      if(numOfUpvotes == 1){
        upvoteText = "badplats"
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
      
      <View style={styles.socialContainer}>
          <View style={styles.socialButton}>
          <Text style={{fontSize: 17, fontFamily: "ProductSans-Regular"}}>Du har <Text style={styles.favStyle}>{numOfFavorites}</Text> {favoriteText} </Text>
          <Icon  name='star' size={20} color='#1967d2'  style={{marginLeft:5}} light  />

          </View>


          <View  style={styles.socialButton}>
          <Text style={{fontFamily: "ProductSans-Regular", fontSize: 17}}>Du gillar <Text style={styles.favStyle}>{numOfUpvotes}</Text> {upvoteText}</Text>
          <Icon  name='thumbs-up' size={20} color='#1967d2'  style={{marginLeft:5}} light  />
          </View>                  
        </View>
      
   
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
  socialContainer:{
    flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      marginTop:10,
      marginBottom:30,
      paddingHorizontal:5,
      width:width,
      paddingVertical:0,
  },
  socialButton:{
    flexDirection:'row',
    alignItems:'center',
    marginVertical: 20
  },
  socialText:{
    fontFamily:'ProductSans-Regular',
    marginRight:5,
    fontSize: 17
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
    marginTop:20,
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
