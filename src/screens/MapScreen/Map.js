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
  }


  class Map extends Component {
    constructor(props){
        super(props)
        this.state = {
            curPos: defaultRegion,
            curAng: 45,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            detailVisible:false
        }
    }
    moveToUserLocation = () => {
        geoService.getCurrentLocation().then(position => {
            if (position) {
                this.setState({
                  curPos: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.003,
                    longitudeDelta: 0.003,
                  },
              }, () => this.updateMap());
            }
        });
        
    }

    


    handleMarkerSelect = (marker, index) => {
      console.log(marker, "hey")
      this.props.onDetailOpen(marker)
      this.props.onSelectMarker(index)
      this.map.animateCamera({ center: marker.location, zoom:20 });

    }

    updateMap(){
      this.map.animateCamera({ center: this.state.curPos });
    }

    render() {
      const { badmarkers } = this.props
      return (
        <View style={styles.mapWrapper}>    
            <MapView
                ref={(el) => (this.map = el)}
                initialRegion={{
                  ...this.state.curPos,
                  latitudeDelta: this.state.latitudeDelta,
                  longitudeDelta: this.state.longitudeDelta}}
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
  
  
  export default  Map;