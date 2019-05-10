import React, { Component} from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'react-native-elements';
import { Navigation } from 'react-native-navigation'
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ImageViewer from 'react-native-image-zoom-viewer'
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect } from 'react-redux'
import { userActions } from '../../redux/modules/user/actions';
import { bindActionCreators } from "redux";


const window = Dimensions.get('window');

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

class BadDetailScreen extends Component{
    constructor(props){
        super(props)
        Navigation.events().bindComponent(this);
        this.state ={
            index: 0,
            modalVisible: false,
            isFavorited:false,
            isLiked: false
        }
    }
    componentDidMount(){
        Navigation.mergeOptions(this.props.componentId, {
          statusBar: {
            style: 'light'
          },
            topBar: {
              visible: false,
              leftButtons: [
                {
                  id: 'detail_done',
                  systemItem: 'done',
                  color: 'black'
                }
              ],
            }
          });
    }

    navigationButtonPressed({ buttonId }) {
        const { data } = this.props;
    
        switch (buttonId) {
          case 'detail_done': {
            Navigation.dismissModal(this.props.componentId)
            //pushTutorialScreen();
            break;
          }
          default:
            break;
        }
    }

    navigateToMarkerMap = () => {
      Navigation.dismissModal(this.props.componentId)
      this.props.events.emit('navigateToMapMarker', this.props.marker,this.props.index )   
    }

    componentDidUpdate(oldProps){
      
    }

    addToFavorites = () => {
      const { actions, marker, user } = this.props
      let isFavorited = user.favorites.indexOf(marker.id) != -1;
      if(isFavorited){
        //remove from favorites
        actions.removeFromFavorites(this.props.marker.id)
      }
      else{
        //add to favorites
        actions.addToFavorites(this.props.marker.id)

      }
      // this.setState({isFavorited:!this.state.isFavorited})
    }

    addToUpvoted = () => {
      const { actions, marker, user } = this.props
      let isUpvoted = user.upvoted.indexOf(marker.id) != -1;
      console.log(isUpvoted)
      if(isUpvoted){
        //remove from favorites
        actions.removeFromUpvoted(this.props.marker.id)
      }
      else{
        //add to favorites
        actions.addToUpvotes(this.props.marker.id)


      }
      // this.setState({isFavorited:!this.state.isFavorited})
    }

    render(){
      console.log(this.props.marker)
        const default_images = [
            {
              url: this.props.marker.information.previewImage
            },
            {
                url: this.props.marker.information.previewImage
             },
            
          ];
        const { marker, user } = this.props
        // console.log(marker, user)
        let isFavorited = user.favorites.indexOf(marker.id) != -1;
        let isUpvoted = user.upvoted.indexOf(marker.id) != -1;

        // console.log(isFavorited)
        const images = marker.information.images ? marker.information.images : default_images

        let summary = null
        let quality = null;

        if(marker.baddetail.summary){
          summary = marker.baddetail.summary
        }
        console.log(marker)
        if(marker.detail && marker.detail.qualityRating){
          quality = marker.detail.qualityRating[1].ratingText;
        }

        return (
            <HeaderImageScrollView
                minOverlayOpacity={0}
                maxOverlayOpacity={0}
                maxHeight={200}
                minHeight={0}
                useNativeDriver={true}
                headerImage={{uri:marker.information.previewImage}}
                
                renderForeground={() => (
                  <TouchableOpacity onPress={()=>console.log("hey")} style={{ height: 200, justifyContent: "center", alignItems: "center"}} >
                    <TouchableOpacity onPress={() => Navigation.dismissModal(this.props.componentId) } style={styles.backButton}>
                    <Icon name="chevron-left" size={30} color="white" style={styles.close} />
                      
                      {/* <Text style={{fontWeight: 'bold', color:'black', fontSize: 15}}> Go back</Text> */}
                    </TouchableOpacity>
                    <View style={styles.upvotes}>
                      <Text style={{color:'#1967d2', fontWeight:'bold'}}> {marker.information.upvotes} har gillat denna badplats</Text>
                    </View>
                    
                  </TouchableOpacity>
                )}
              >
                <View style={styles.customRadius}/>

                
                <View style={styles.scrollContent}>
                  <TriggeringView onHide={() => console.log("text hidden")}>
                  <View style={{flexDirection:'row', justifyContent:'center',alignItems:'center',width:window.width, backgroundColor:'transparent'}}>
                  
                    
                      <TouchableOpacity style={styles.titleContainer} onPress={() => this.props.cameFromList && this.navigateToMarkerMap()}>
                        <Text  numberOfLines={2} style={styles.titleStyle}>{marker.information.name}</Text>
                      </TouchableOpacity>
                     
                    </View>
                    
                    <View style={styles.socialContainer}>
                      <TouchableOpacity onPress={this.addToFavorites} style={styles.socialButton}>
                      <Text style={[styles.socialText, {fontFamily: isFavorited ? "ProductSans-Bold": "ProductSans-Regular"} ]}>{isFavorited ? 'Tillagd i favoriter' : 'Lägg till i favoriter'}</Text>
                      <Icon  name={isFavorited ? 'star' : null} size={20} color='#1967d2'  style={{marginLeft:0}} light  />
                      </TouchableOpacity>


                      <TouchableOpacity onPress={this.addToUpvoted} style={styles.socialButton}>
                      <Text style={[styles.socialText, {fontFamily: isUpvoted ? "ProductSans-Bold": "ProductSans-Regular"} ]}>{isUpvoted ? 'Gillar badplats' : 'Gilla badplats'}</Text>
                      <Icon  name={isUpvoted ? 'thumbs-up' : null} size={20} color='#1967d2'  style={{marginLeft:0}} light  />
                      </TouchableOpacity>
                      
                    </View>
                    

                     <View style={styles.locationDesc}>
                       <Text style={styles.descTitle} numberOfLines={5}>{ summary }</Text>
                     </View>
                  </TriggeringView>
                </View>
              </HeaderImageScrollView>
                
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
        
        // justifyContent:'center',
        // alignItems:'center',
    },
    socialContainer:{
      flexDirection:'row',
      justifyContent:'space-evenly',
      marginTop:10,
      paddingVertical:10
    },
    socialButton:{
      flexDirection:'row',
    },
    socialText:{
      fontFamily:'ProductSans-Regular',
      marginRight:5,
      fontSize: 17
    },
    locationDesc:{
      width:window.width,
      marginLeft:0,
      marginTop: 20,
      paddingHorizontal:20,
      alignItems:'center'

    },
    upvotes:{
      padding:10,
      borderRadius:20,
      alignItems:'center',
      justifyContent:'center',
      marginTop:10,
      backgroundColor:'rgba(255,255,255, .9)',
      fontFamily:'ProductSans-Regular'
    },
    descTitle:{
      fontSize:15,
      fontFamily:'ProductSans-Regular'
    },
    background: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: window.width,
      height: PARALLAX_HEADER_HEIGHT
    },
    titleStyle:{
      backgroundColor: "transparent", 
      color:'#1967d2', 
      fontWeight: 'bold',
      fontSize:18,
      fontFamily:'ProductSans-Regular',
      
    },
    titleContainer:{
      backgroundColor:'#e8f0fe',
      paddingVertical:20,
      paddingHorizontal: 10,
      borderRadius:20,
      width:window.width-20,
      alignItems:'center',
      justifyContent:'center',
      flexDirection:'row',
     
      
      paddingBottom:20
    },
    scrollContent:{
      height: 1000,
      backgroundColor:'white',
      alignItems:'flex-start',
    },
    backButton:{
      position:'absolute',
      top:30, 
      left: 10, 
      backgroundColor: 'transparent', 
      padding: 10, 
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 1.25,
      shadowRadius: 3.84,

    },
    customRadius:{
      height: 70,
      position:'absolute',
      top:-10,
      backgroundColor:'white',
      left:-3,
      right:3,
      width:window.width+6,
      zIndex:0,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: -10,
      },
      shadowOpacity: 0.15,
      shadowRadius: 5.84,

      elevation: 5,

    }
})

const mapStateToProps = (state, props)=>{
  const { user, markers } = state
  console.log(markers.markers[props.index])
  return  {
    user,
    marker:markers.markers[props.index] 
  }
}
const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    actions: bindActionCreators(userActions, dispatch),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(BadDetailScreen);

