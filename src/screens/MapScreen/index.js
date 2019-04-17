import { connectData } from 'src/redux';
import React, { Component } from "react";
import { Navigation } from 'react-native-navigation';
import { pushTutorialScreen } from 'src/navigation';
import Map from '../../components/map/Map'
import {
    Image,
    Platform,
    View,
    StyleSheet,
    TouchableWithoutFeedback
  } from "react-native";
import { applyThemeOptions } from '../../styling'


  class MapScreen extends Component {
    constructor(props){
        super(props)
        Navigation.events().bindComponent(this);
    }

    static get options() { 
        return applyThemeOptions({
          statusBar:{
            backgroundColor: 'blue'
          },
          topBar:{
            noBorder:true,
            title:{
              component: {
                name: 'custom.TopBarBackground',
                alignment: 'fill'
              }
            },
            
            
          },
          
        });
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
    render() {
      return (
        <View style={styles.container}>    
            <Map />
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      flexDirection: "column",
      justifyContent: "flex-end"
    }
  });
  
  export default connectData()(MapScreen);
