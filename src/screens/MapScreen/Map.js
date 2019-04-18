import React, { Component } from "react";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import {
    Image,
    Platform,
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback
  } from "react-native";
  import {geoService} from '../../services'
import { Overlay } from 'react-native-elements'
  import locationButtonActive from "../../assets/images/location_active_ios.png";
import BadMarker from "./BadMarker";
  const defaultRegion = {
    latitude: 59.329323,
    longitude: 18.068581,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }


  export const badmarkers = [
    {
      information:{
        name:'Test'
      },
      location: { longitude: 18.267003, latitude: 59.291998 },
    },
  ];

  class Map extends Component {
    constructor(props){
        super(props)
        this.state = {
            region: defaultRegion,
            detailVisible:false
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

    handleMarkerSelect = (event) => {
      this.props.onDetailOpen()

    }

    render() {
      
      return (
        <View style={styles.mapWrapper}>    
            <MapView
                region={this.state.region}
                style={StyleSheet.absoluteFill}>

            <BadMarker 
              badmarkers={badmarkers}
              markerSelect={this.handleMarkerSelect}/>
            </MapView>
          

          <View style={styles.touchable}>
            <TouchableWithoutFeedback
              onPress={this.moveToUserLocation}
              hitSlop={{ top: 50, left: 10, right: 10, bottom: 10 }}>
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
    },
    detailOverlay:{
      alignSelf:'center',
      
    },
})
  
  
  export default Map;