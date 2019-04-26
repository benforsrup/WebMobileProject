import React, { Component} from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'react-native-elements';
import { Navigation } from 'react-native-navigation'
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ImageViewer from 'react-native-image-zoom-viewer'
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';
import Icon from 'react-native-vector-icons/FontAwesome';


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
            modalVisible: false
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

    render(){
        const default_images = [
            {
              url: this.props.marker.information.previewImage
            },
            {
                url: this.props.marker.information.previewImage
             },
            
          ];
        const { marker } = this.props
        const images = marker.information.images ? marker.information.images : default_images
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
                    <Icon  name="chevron-left" size={30} color="white" style={styles.close} />

                      {/* <Text style={{fontWeight: 'bold', color:'black', fontSize: 15}}> Go back</Text> */}
                    </TouchableOpacity>
                    
                  </TouchableOpacity>
                )}
              >
                <View style={styles.customRadius}/>

                
                <View style={styles.scrollContent}>
                  <TriggeringView onHide={() => console.log("text hidden")}>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                      <TouchableOpacity onPress={() => console.log("tap!!")}>
                        <Text style={styles.titleStyle}>{marker.information.name}</Text>
                      </TouchableOpacity>
                     {this.props.cameFromList && <TouchableOpacity onPress={this.navigateToMarkerMap}>
                        <Text style={{marginLeft: 40}} >Open in map</Text>
                      </TouchableOpacity>
                     }
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
        backgroundColor: 'hotpink', 
        overflow: 'hidden'
        // justifyContent:'center',
        // alignItems:'center',
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
      color:'rgba(107, 185, 240, 1)', 
      fontWeight: 'bold',
      fontSize:30,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.15,
      shadowRadius: 1.84,
    },
    scrollContent:{
      height: 1000,
      backgroundColor:'rgba(240, 250, 252, 1)',
      justifyContent:'flex-start',
      alignItems:'center',
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
      top:-50,
      backgroundColor:'rgba(240, 250, 252, 1)',
      left:0,
      right:0,
      width:window.width,
      zIndex:0,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
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

export default BadDetailScreen


//  <Text> hey</Text>
//                 <TouchableOpacity onPress={() => this.setState({modalVisible: true})}>
//                     <Image
//                     source={{ uri: marker.information.previewImage }}
//                     style={{ width: 200, height: 200 }}
//                     /></TouchableOpacity>

//                 <Modal
//                     visible={this.state.modalVisible}
//                     transparent={true}
//                     onRequestClose={() => this.setState({ modalVisible: false })}
//                     >
//                     <ImageViewer
//                         imageUrls={images}
//                         enableImageZoom={false}
//                         index={this.state.index}
//                         onSwipeDown={() => {
//                         this.setState({modalVisible: false})
//                         }}
//                         onMove={data => console.log(data)}
//                         enableSwipeDown={true}
//                     />
//                     </Modal> 