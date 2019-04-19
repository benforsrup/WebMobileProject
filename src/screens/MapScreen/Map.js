import React, { Component } from "react";
import MapView, { Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import {
    Image,
    Platform,
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
    ScrollView
  } from "react-native";
  import {geoService} from '../../services'
import { Overlay } from 'react-native-elements'
import locationButtonActive from "../../assets/images/location_active_ios.png";
import BadMarker from "./BadMarker";
import { BlurView } from "@react-native-community/blur";
import DetailCard from "./DetailCard";



  const defaultRegion = {
    latitude: 59.329323,
    longitude: 18.068581,
  }


const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = width - 20;


  class Map extends Component {
    constructor(props){
        super(props)
        this.state = {
            curPos: defaultRegion,
            curAng: 45,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            detailVisible:false,
            ref:null

        }
    }

    componentWillMount() {
      this.index = 0;
      this.animation = new Animated.Value(0);
    }

    componentDidMount() {
      this.moveToUserLocation()
      this.setState({
        ref:this.ref
    })
      // We should detect when scrolling has stopped then animate
      // We should just debounce the event listener here
      this.animation.addListener(({ value }) => {
        let index = Math.floor(value / CARD_WIDTH + 0.5); // animate 30% away from landing on the next item
        if (index >= this.props.badmarkers.length) {
          index = this.props.badmarkers.length - 1;
        }
        if (index <= 0) {
          index = 0;
        }
  
        clearTimeout(this.regionTimeout);
        this.regionTimeout = setTimeout(() => {
          if (this.index !== index) {
            this.index = index;
            const { location } = this.props.badmarkers[index];
            this.map.animateToRegion(
              {
                ...location,
                latitudeDelta: this.state.latitudeDelta,
                longitudeDelta: this.state.longitudeDelta,
              },
              350
            );
          }
        }, 10);
      });
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
      //this.props.onDetailOpen(marker)
      //this.props.onSelectMarker(index)
      this.map.animateCamera({ center: marker.location, zoom:20 });

    }

    updateMap(){
      this.map.animateCamera({ center: this.state.curPos });
    }

    render() {
      const { badmarkers } = this.props

      const interpolations = badmarkers.map((marker, index) => {
        const inputRange = [
          (index - 1) * CARD_WIDTH,
          index * CARD_WIDTH,
          ((index + 1) * CARD_WIDTH),
        ];
        const scale = this.animation.interpolate({
          inputRange,
          outputRange: [1, 2.5, 1],
          extrapolate: "clamp",
        });
        const opacity = this.animation.interpolate({
          inputRange,
          outputRange: [0.35, 1, 0.35],
          extrapolate: "clamp",
        });
        return { scale, opacity };
      });

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
          
            <Animated.ScrollView
              horizontal
              scrollEventThrottle={1}
              showsHorizontalScrollIndicator={true}
              snapToInterval={CARD_WIDTH+20}
              decelerationRate={0}
              snapToAlignment={"center"}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        x: this.animation,
                      },
                    },
                  },
                ],
                { useNativeDriver: true }
              )}
              style={styles.scrollView}
              contentContainerStyle={styles.endPadding}
            >

            {badmarkers.map((marker, index) => (
                  <DetailCard marker={marker} />
                  
              ))}

            </Animated.ScrollView>


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
    scrollView: {
      position: "absolute",
      bottom: 80,
      left: 0,
      right: 0,
      paddingVertical: 10,
      paddingHorizontal:0,
    },
    card: {
      padding: 10,
      elevation: 2,
      marginHorizontal: 10,
      shadowColor: "#000",
      borderRadius:20,
      shadowRadius: 5,
      shadowOpacity: 0.3,
      shadowOffset: { x: 2, y: -2 },
      height: CARD_HEIGHT,
      width: CARD_WIDTH,
      overflow: "hidden",
    },
    cardImage: {
      flex: 3,
      width: "100%",
      height: "100%",
      alignSelf: "center",
    },
    textContent: {
      flex: 1,
    },
    cardtitle: {
      fontSize: 12,
      marginTop: 5,
      fontWeight: "bold",
    },
    cardDescription: {
      fontSize: 12,
      color: "#444",
    },
})
  
  
  export default  Map;