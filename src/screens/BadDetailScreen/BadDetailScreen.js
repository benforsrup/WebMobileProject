import React, { Component} from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Image } from 'react-native-elements';
import { Navigation } from 'react-native-navigation'
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ImageViewer from 'react-native-image-zoom-viewer'
import HeaderImageScrollView, { TriggeringView } from 'react-native-image-header-scroll-view';


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
                  <View style={{ height: 200, justifyContent: "center", alignItems: "center"}} >
                    <TouchableOpacity onPress={() => Navigation.dismissModal(this.props.componentId) } style={{position:'absolute', top:30, left: 10, backgroundColor: 'white', padding: 10, borderRadius: 10}}>
                      <Text style={{fontWeight: 'bold', color:'black', fontSize: 15}}> Go back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => console.log("tap!!")}>
                      <Text style={{ backgroundColor: "transparent", color:'white', fontWeight: 'bold', fontSize:30 }}>{marker.information.name}</Text>
                    </TouchableOpacity>
                  </View>
                )}
              >
                <View style={{ height: 1000 }}>
                  <TriggeringView onHide={() => console.log("text hidden")}>
                    <Text>Scroll Me!</Text>
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