import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
    View, Text, StyleSheet, Dimensions
} from 'react-native'
import { Navigation } from 'react-native-navigation';
import Icon from 'react-native-vector-icons/FontAwesome';
import { applyThemeOptions } from 'src/styling'
import { transparent } from '../../constants/colors';
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
    }
    
    closeOverlay = async() =>{
        console.log(this.props.componentId)
        await Navigation.dismissOverlay(this.props.componentId)
    } 

    render(){
        return(
            <View style={styles.container} onPress={this.closeOverlay} >
                    <Icon onPress={this.closeOverlay} name="times" size={30} color="#900" style={styles.close} />
            </View>
        )
    }
}


const styles = StyleSheet.create({
    container:{
        position:'absolute',
        width:width,
        backgroundColor:'rgba(0,0,0,0.5)',
        height:height/4,
        zIndex:10,
        bottom:0,
        marginBottom:0,
        borderRadius:20,
        flex:1,
        justifyContent:'center',
        alignItems:'center' 
    },
    close:{
        position:'absolute',
        right:20,
        top:20
    }
})
export default DetailOverlay