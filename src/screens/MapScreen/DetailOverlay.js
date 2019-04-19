import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    View, Text, StyleSheet, Dimensions
} from 'react-native'
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { applyThemeOptions } from 'src/styling'
import { transparent } from '../../constants/colors';
import { BlurView } from "@react-native-community/blur";
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux'

const width=Dimensions.get('window').width;
const height = Dimensions.get('window').height;
class DetailOverlay extends React.Component{
    static get options() { 
        return applyThemeOptions({
          statusBar:{
            backgroundColor: 'blue'
          },
          topBar:{
            noBorder:true,
            title:{
              component: {
                name: 'custom.TopBarBackground',
                alignment: 'fill'
              }
            },      
          },    
        });
      }
    constructor(props) {
        super(props);
        Navigation.events().bindComponent(this);
        this.state={
            ref:null
        }
    }

    componentDidMount(){
        this.setState({
            ref:this.ref
        })
    }
    
    closeOverlay = () =>{
        console.log(this.props)
        this.props.events.emit('closeDetail')
        this.animatable.slideOutDown(1000)
        setTimeout(async() => await Navigation.dismissOverlay(this.props.componentId)  , 1000)
        
    } 

    render(){
        const {marker, selectedMarker} = this.props
        return(
            <Animatable.View 
                ref={ref => { this.animatable = ref }}
                animation="slideInUp"
                duration={200}
                style={styles.blurContainer}>
                {this.state.ref &&
                <BlurView 
                    style={[StyleSheet.absoluteFillObject, {borderRadius:20}]}
                    
                    blurType="light"
                    viewRef={this.state.ref}
                    blurAmount={10} />}
                
                    
                <View style={styles.detailContainer} ref={ref => this.ref = ref} >
                        <Icon onPress={this.closeOverlay} name="times" size={30} color="white" style={styles.close} />
                        <Text> {selectedMarker.information.name} </Text>
                </View>
                
                </Animatable.View>
        )
    }
}


const styles = StyleSheet.create({
    blurContainer:{
        
        height:300,
        width:width-20,
        bottom:0,
        backgroundColor:'rgba(30, 139, 195, 0.5)',
        marginTop:height-310,
        marginBottom:10,
        marginLeft:10,
        borderRadius:20,
        overflow:'hidden',
        borderColor:'lightgreen'
    },
    detailContainer:{
        justifyContent:'center',
        alignItems:'center',
        height:300
    },
    close:{
        position:'absolute',
        right:20,
        top:20
    }
})

const mapStateToProps = state =>{
    const selectedIndex = state.markers.selectedIndex
    const selectedMarker = state.markers.markers[selectedIndex]
    return{
        selectedMarker
    }
}



export default connect(mapStateToProps, null)(DetailOverlay);