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
        this.animatable.slideOutDown(200)
        setTimeout(async() => await Navigation.dismissOverlay(this.props.componentId)  , 400)
        
    } 

    render(){
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
                
                    
                <View  ref={ref => this.ref = ref} >
                        <Icon onPress={this.closeOverlay} name="times" size={30} color="#900" style={styles.close} />
                </View>
                
                </Animatable.View>
        )
    }
}


const styles = StyleSheet.create({
    blurContainer:{
        
        height:300,
        width:width,
        bottom:0,
        backgroundColor:'rgba(0,200,0,0.3)',
        marginTop:height-300,
        marginBottom:0,
        borderRadius:20,
        overflow:'hidden',
        borderColor:'lightgreen'
    },
    close:{
        position:'absolute',
        right:20,
        top:20
    }
})
export default DetailOverlay