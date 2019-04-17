import React, { Component } from "react";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import {
    Image,
    Platform,
    View,
    StyleSheet,
    TouchableWithoutFeedback
  } from "react-native";
  import {geoService} from '../../services'

  import locationButtonActive from "../../assets/images/location_active_ios.png";
  const defaultRegion = {
    latitude: 59.329323,
    longitude: 18.068581,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }
  class MapScreen extends Component {
    constructor(props){
        super(props)
        this.state = {
            region: defaultRegion
        }
    }
    moveToUserLocation = () => {
        console.log(geoService)
        geoService.getCurrentLocation().then(position => {
            if (position) {
                console.log(position)
              this.setState({
                region: {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                  latitudeDelta: 0.003,
                  longitudeDelta: 0.003,
                },
              });
            }
        });
    }

    render() {
      
      return (
        <View style={styles.mapWrapper}>    
            <MapView
                region={this.state.region}
                style={StyleSheet.absoluteFill}
          />
          <View style={styles.touchable}>
            <TouchableWithoutFeedback
              onPress={this.moveToUserLocation}
              hitSlop={{ top: 50, left: 10, right: 10, bottom: 10 }}
            >
              <View>
                <Image
                  accessibilityLabel="Show my location"
                  source={locationButtonActive}
                  style={styles.image}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

        </View>
      );
    }
  }
  

  const styles = StyleSheet.create({
    mapWrapper: {
      ...StyleSheet.absoluteFillObject,
      justifyContent: "space-between",
      alignItems: "center",
      zIndex: -1
    },
    tileContainer: {
      width: "100%"
    },
    touchable: {
      alignSelf: "flex-end",
      marginTop: Platform.OS === "ios" ? 100 : 8,
      paddingRight: Platform.OS === "ios" ? 0 : 8,
      paddingLeft: 10,
      paddingBottom: 10
    },
    image: {
      width: 48,
      height: 48
    }
})
  
  
  export default MapScreen;