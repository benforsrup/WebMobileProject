import React, { Component} from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Image } from 'react-native-elements';
import { Navigation } from 'react-native-navigation'

import ImageViewer from 'react-native-image-zoom-viewer'

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
              visible: true,
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
            <View style={styles.container}>
                <Text> hey</Text>
                <TouchableOpacity onPress={() => this.setState({modalVisible: true})}>
                    <Image
                    source={{ uri: marker.information.previewImage }}
                    style={{ width: 200, height: 200 }}
                    /></TouchableOpacity>

                <Modal
                    visible={this.state.modalVisible}
                    transparent={true}
                    onRequestClose={() => this.setState({ modalVisible: false })}
                    >
                    <ImageViewer
                        imageUrls={images}
                        enableImageZoom={false}
                        index={this.state.index}
                        onSwipeDown={() => {
                        this.setState({modalVisible: false})
                        }}
                        onMove={data => console.log(data)}
                        enableSwipeDown={true}
                    />
                    </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
    }
})

export default BadDetailScreen