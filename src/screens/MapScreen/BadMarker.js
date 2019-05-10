import React, { Fragment } from "react";
import { View, StyleSheet, Text, Animated } from "react-native";
import { Marker } from "react-native-maps";
import { lightNavyBlueColor, transparent } from '../../constants/colors'
import isEqual from 'lodash.isequal'
export default class BadMarker extends React.Component{
    state = {
      tracksViewChanges: true,
    }

    componentWillReceiveProps(nextProps) {
      if (!isEqual(this.props, nextProps)) {
        this.setState(() => ({
          tracksViewChanges: true,
        }))
      }
    }
    componentDidUpdate() {
      if (this.state.tracksViewChanges) {
        this.setState(() => ({
          tracksViewChanges: false,
        }))
      }
    }
    

    render(){
        const { badmarkers, markerSelect, animations, detailOpen} = this.props
        if(badmarkers.length == 0){
            return null;
        }
        

        return (
            <Fragment>
                {badmarkers.map((marker, index) => {
                    let favorite = this.props.favorites.indexOf(marker.id) != -1 
                    
                    return(
                    <Marker
                        tracksViewChanges={this.state.tracksViewChanges}
                        key={index}
                        coordinate={marker.location}
                        centerOffset={{ x: 0, y: -15 }}
                        pinColor={this.props.currentSelectedIndex === index ? "rgb(0, 255, 255)": null}
                        style={this.props.currentSelectedIndex === index ? styles.markerStyle: null}
                        onPress={() => markerSelect(marker, index)}
                        stopPropagation
                    >
                        <Animated.View style={[styles.markerView]}>
                            <View style={[
                              styles.markerTextWrapper,
                              this.props.currentSelectedIndex === index && styles.selectedMarker,
                              favorite && styles.favMarker,
                              
                            ]}>
                            <Text type="h4" style={[
                              styles.markerTextStyle,
                              this.props.currentSelectedIndex === index && styles.selectedMarkerTextStyle,
                              favorite && styles.favMarkerTextStyle,
                              
                              ]}>
                                🏊‍
                                
                            </Text>
                            </View>
                            <View style={[
                              styles.triangle, 
                              this.props.currentSelectedIndex === index && styles.selectedMarkerTriangle,
                              favorite && styles.favMarkerTextTriangle,

                             
                              ]} />
                        </Animated.View>
                    </Marker>
                )})}
            </Fragment>
        )
    }
}



const styles = StyleSheet.create({
    markerView: {
      alignItems: "center",
      justifyContent: "center",
      
    },
    markerStyle:{
      zIndex: 1,  
    },
    favMarker:{
      backgroundColor: 'yellow',
      padding: 10
    },
    favMarkerTextStyle:{
      color: 'rgba(25, 181, 254, 1)'
    },
    markerTextStyle:{
      color:'white',
      fontWeight:'bold',
      fontSize: 20
    },
    favMarkerTextTriangle:{
      borderBottomColor: 'yellow',

    },
    selectedMarkerTextStyle:{
      color:'white'
    },

    selectedMarker:{
      backgroundColor: 'rgba(25, 120, 254, 1)',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 3.84,
    },
    selectedMarkerTriangle:{
      borderBottomColor: 'rgba(25, 120, 254, 1)',

    },
    markerTextWrapper: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      backgroundColor: 'rgba(25, 181, 254, 1)',
      height: 40,
      width: 40,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 5,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.52,
      shadowRadius: 2.22,

      elevation: 3,
      
      
    },
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: transparent,
      borderStyle: "solid",
      borderLeftWidth: 8,
      borderRightWidth: 8,
      borderBottomWidth: 13,
      zIndex:10,
      borderLeftColor: transparent,
      borderRightColor: transparent,
      borderBottomColor: 'rgba(25, 181, 254, 1)',
      transform: [{ rotate: "180deg" }]
    }
  });

