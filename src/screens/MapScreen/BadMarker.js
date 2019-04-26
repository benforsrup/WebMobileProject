import React, { Fragment } from "react";
import { View, StyleSheet, Text, Animated } from "react-native";
import { Marker } from "react-native-maps";
import { lightNavyBlueColor, transparent } from '../../constants/colors'

export default class BadMarker extends React.Component{

    

    render(){
        const { badmarkers, markerSelect, animations, detailOpen} = this.props
        if(badmarkers.length == 0){
            return null;
        }
        return (
            <Fragment>
                {badmarkers.map((marker, index) => {
                    const scaleStyle = {
                        transform: [
                          {
                            scale: detailOpen ? animations[index].scale : 1 ,
                          },
                        ],
                      };
                      const opacityStyle = {
                        opacity: detailOpen ? animations[index].opacity: 1,
                      };
                    return(
                    <Marker
                        key={index}
                        coordinate={marker.location}
                        centerOffset={{ x: 0, y: -15 }}
                        onPress={() => markerSelect(marker, index)}
                        stopPropagation
                    >
                        <Animated.View style={[styles.markerView]}>
                            <View style={styles.markerTextWrapper}>
                            <Text type="h4" style={{color:'white', fontWeight:'700'}}>
                                {marker.information.name}
                                
                            </Text>
                            </View>
                            <View style={styles.triangle} />
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
      justifyContent: "center"
    },
    markerTextWrapper: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      backgroundColor: 'rgba(25, 181, 254, 1)',
      height: 50,
      width: 100,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      
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
