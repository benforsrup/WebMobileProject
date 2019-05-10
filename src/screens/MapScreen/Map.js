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
    Easing,
    Dimensions,
    ScrollView
  } from "react-native";
  import {geoService} from '../../services'
import { Overlay } from 'react-native-elements'
import locationButtonActive from "../../assets/images/location_active_ios.png";
import BadMarker from "./BadMarker";
import { BlurView } from "@react-native-community/blur";
import DetailCard from "./DetailCard";
import Carousel, { Pagination, getInputRangeFromIndexes } from 'react-native-snap-carousel';
import { Navigation } from 'react-native-navigation'
import {mapStyle} from '../../constants/colors'
import { connect } from 'react-redux'
const defaultRegion = {
  latitude: 59.334591,
  longitude: 18.063240,
}

const { width, height } = Dimensions.get("window");


function wp (percentage) {
    const value = (percentage * width) / 100;
    return Math.round(value);
}


const CARD_WIDTH = wp(85);
const CARD_HEIGHT = height * 0.36;
const sliderWidth = width;

  class Map extends Component {
    constructor(props){
        super(props)
        this.state = {
            curPos: defaultRegion,
            currentSelectedIndex: null,
            curAng: 45,
            latitudeDelta: 0.08,
            longitudeDelta: 0.08,
            detailVisible:false,
            detailMoveAnim: new Animated.Value(400),
            bottomTabsHeight:80,
            hasAlreadyAnimated: false,
            zoomLevel:13,
            favoriteHasChanged: false
        }
    }

    componentWillMount() {
      this.index = 0;
      this.animation = new Animated.Value(0);
    }

    

   async componentDidMount() {
      // this.moveToUserLocation()
      const constants = await Navigation.constants();
      const bottomTabsHeight = constants.bottomTabsHeight;
      this.setState({bottomTabsHeight: bottomTabsHeight})
    }
    
    moveToUserLocation = () => {
      // console.log("moveToUserLocation")
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
      if(!this.state.detailVisible){
        Animated.timing(                  // Animate over time
          this.state.detailMoveAnim,            // The animated value to drive
          {
            toValue: this.state.bottomTabsHeight,
            duration: 400,   
            useNativeDriver: true           // Make it take a while
          }
        ).start();   
        this.setState({detailVisible: true, hasAlreadyAnimated: true, currentSelectedIndex: index})
      }
      
      this.cardListRef.snapToItem(index)
      // this.cardListRef.getNode().scrollTo({x:index*(CARD_WIDTH+20)})
      let r = {
        latitude: marker.location.latitude,
        longitude: marker.location.longitude,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
    };
      //this.map.animateToRegion(r, 300);

     

    }

    updateMap(){
      //this.map.animateCamera({ center: this.state.curPos, zoom: 13 });
      let r = {
        latitude: this.state.curPos.latitude,
        longitude: this.state.curPos.longitude,
        latitudeDelta: this.state.latitudeDelta,
        longitudeDelta: this.state.longitudeDelta,
    };
      this.map.animateToRegion(r, 300)
      
    }

    handleOnPress = (event) => {
      this.setState({detailVisible: false, currentSelectedIndex: null})
      Animated.timing(                  // Animate over time
        this.state.detailMoveAnim,            // The animated value to drive
        {
          toValue: 400,
          duration: 200, 
          useNativeDriver: true             // Make it take a while
        }
      ).start();   


    }

    componentDidUpdate(oldProps){
      // console.log(oldProps, this.props)
      if(oldProps.openedFromList != this.props.openedFromList){
        // console.log("hey called")

        Animated.timing(                  // Animate over time
          this.state.detailMoveAnim,            // The animated value to drive
          {
            toValue: this.state.bottomTabsHeight,
            duration: 400, 
            useNativeDriver: true             // Make it take a while
          }
        ).start(); 
        const marker = this.props.badmarkers[this.props.selectedMarkerIndex];
        let r = {
          latitude: marker.location.latitude,
          longitude: marker.location.longitude,
          latitudeDelta: this.state.latitudeDelta,
          longitudeDelta: this.state.longitudeDelta,
        }
        //this.map.animateToRegion(r, 350);
        this.cardListRef.snapToItem(this.props.selectedMarkerIndex, true)
      }
      if(oldProps.favorites.length !=this.props.favorites.length){
        this.setState({favoriteHasChanged:!this.state.favoriteHasChanged})
      }
    }

    handleAnimationEvent = (event) => {
      let value = event.nativeEvent.contentOffset.x;
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
            const marker = this.props.badmarkers[index];

            let r = {
              latitude: marker.location.latitude,
              longitude: marker.location.longitude,
              latitudeDelta: 0.04,
              longitudeDelta: 0.04,
            }
            this.map.animateToRegion(r, 350);
            this.setState({ currentSelectedIndex: index})



          }
        }, 10);
      

    }

    
    openDetail = (index) => {
      const marker = this.props.badmarkers[index];
      this.props.onSelectMarker(index)
      this.props.onDetailOpen(marker, index)
    }

    _renderCardItem = ({item, index}) => {
      let isFavorite = this.props.favorites.indexOf(item.id) != -1;
      
      return <DetailCard marker={item} index={index} isFavorite={isFavorite} key={item.id} openDetail={this.openDetail}/>
    }

    onCardScroll = (event) => {
      Animated.event(
        [
          {
            nativeEvent:{
              contentOffset:{
                x:this.animation
              }
            }
          }
        ]
      )
      // Animated.event(
      //   [
      //     {
      //       nativeEvent: {
      //         contentOffset: {
      //           x: this.animation,
      //         },
      //       },
      //     },
      //   ],
      //   { useNativeDriver: true,
      //   listener: () => this.handleAnimationEvent(event) }
      // )
      
    }

    renderDetailCards = ()=> {
      const { badmarkers } = this.props
      return (
        <Animated.View  style={[styles.scrollView, {bottom: this.state.bottomTabsHeight+30,transform:[{translateY: this.state.detailMoveAnim}]}]}>
                <Carousel
                  ref={(ref) => this.cardListRef = ref}
                  data={badmarkers}
                  renderItem={this._renderCardItem}
                  extraData={this.state.favoriteHasChanged}
                  sliderWidth={sliderWidth}
                  itemWidth={CARD_WIDTH}
                  containerCustomStyle={styles.slider}
                  contentContainerCustomStyle={styles.sliderContentContainer}
                  onScroll={this.handleAnimationEvent}
                  // useScrollView={true}
                  removeClippedSubviews={false} 
                />
        </Animated.View>
      )
    }

    handlePanDrag = (region) => {
      let zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2)
      this.handleZoomLevels(zoom)
    }


    handleZoomLevels = zoom => {
      switch(zoom){
        case 9:
          if(this.state.zoomLevel != 9){
            this.setState({zoomLevel:9})
          }
          break
        case 10:
          if(this.state.zoomLevel != 10){
            this.setState({zoomLevel:10})
          }
          break    
        case 13:
          if(this.state.zoomLevel != 13){
            this.setState({zoomLevel:13})
          }
          break
        
      }
    }
   

    render() {
      const { badmarkers } = this.props;
      const interpolations = badmarkers.map((marker, index) => {
        const inputRange = [
          (index - 1) * CARD_WIDTH,
          index * CARD_WIDTH,
          ((index + 1) * CARD_WIDTH),
        ];
        const scale = this.animation.interpolate({
          inputRange,
          outputRange: [1, 1.2, 1],
          extrapolate: "clamp",
        });
        const opacity = this.animation.interpolate({
          inputRange,
          outputRange: [0.55, 1, 0.55],
          extrapolate: "clamp",
        });
        return { scale, opacity };
      });
      
      


      return (
        <View style={styles.mapWrapper}>    
            <MapView
                ref={(el) => (this.map = el)}
                onRegionChangeComplete={this.handlePanDrag}
                initialRegion={{
                  ...this.state.curPos,
                  latitudeDelta: this.state.latitudeDelta,
                  longitudeDelta: this.state.longitudeDelta}}
                provider={PROVIDER_GOOGLE}
                onPress={this.handleOnPress}
                customMapStyle={mapStyle}
                style={StyleSheet.absoluteFill}>

            <BadMarker 
              currentSelectedIndex= {this.state.currentSelectedIndex}
              badmarkers={badmarkers}
              favorites={this.props.favorites}
              markerSelect={this.handleMarkerSelect}
              animations={interpolations}
              detailOpen={this.state.detailVisible}
              
              />
            </MapView>

            {this.renderDetailCards()}
          
            {/* <Animated.ScrollView
              horizontal
              ref={(ref) => this.cardListRef = ref}
              scrollEventThrottle={1}
              showsHorizontalScrollIndicator={false}
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
                { useNativeDriver: true,
                listener: event => this.handleAnimationEvent(event) }
              )}
              style={[styles.scrollView, {transform:[{translateY: this.state.detailMoveAnim}]}]}
              contentContainerStyle={styles.endPadding}
            >

            {badmarkers.map((marker, index) => (
                  <DetailCard marker={marker} index={index} key={marker.id} openDetail={this.openDetail}/>
                  
              ))}

            </Animated.ScrollView> */}


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
      left: 0,
      right: 0,
      paddingHorizontal:0,
      
    },
    card: {
      padding: 10,
      elevation: 2,
      marginHorizontal: 10,
      shadowColor: "#000",
      backgroundColor:'white',
      borderRadius:20,
      shadowRadius: 5,
      backgroundColor:'transparent',
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
    slider: {
      marginTop: 15,
      overflow: 'visible' // for custom animations
    },
    sliderContentContainer: {
      paddingVertical: 10 // for custom animation
    },
})
  
  




export default Map;


