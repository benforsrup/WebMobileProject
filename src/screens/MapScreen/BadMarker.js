import React, { Fragment } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Marker } from "react-native-maps";
import { lightNavyBlueColor, transparent } from '../../constants/colors'


const BadMarker = ({badmarkers, markerSelect}) =>{
    if(badmarkers.length == 0){
        return null;
    }

    

    return (
        <Fragment>
            {badmarkers.map((marker, index) => (
                <Marker
                    key={index}
                    coordinate={marker.location}
                    centerOffset={{ x: 0, y: -15 }}
                    onPress={() => markerSelect(marker, index)}
                    stopPropagation
                >
                    <View style={styles.markerView}>
                        <View style={styles.markerTextWrapper}>
                        <Text type="h4" color="whiteColor">
                            {marker.information.name}
                        </Text>
                        </View>
                        <View style={styles.triangle} />
                    </View>
                </Marker>
            ))}
        </Fragment>
    )
}

const styles = StyleSheet.create({
    markerView: {
      alignItems: "center",
      justifyContent: "center"
    },
    markerTextWrapper: {
      paddingHorizontal: 8,
      paddingVertical: 2,
      backgroundColor: lightNavyBlueColor,
      height: 30,
      width: 30,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 2
    },
    triangle: {
      width: 0,
      height: 0,
      backgroundColor: transparent,
      borderStyle: "solid",
      borderLeftWidth: 5,
      borderRightWidth: 5,
      borderBottomWidth: 10,
      borderLeftColor: transparent,
      borderRightColor: transparent,
      borderBottomColor: lightNavyBlueColor,
      transform: [{ rotate: "180deg" }]
    }
  });

  export default BadMarker;