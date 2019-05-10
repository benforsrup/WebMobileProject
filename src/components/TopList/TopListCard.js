import { BlurView } from "@react-native-community/blur";
import React, { Fragment } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Marker } from "react-native-maps";
import { lightNavyBlueColor, transparent } from '../../constants/colors'
import { Dimensions, TouchableOpacity } from 'react-native'
import { Image } from 'react-native-elements';
const { width, height } = Dimensions.get("window");


function wp (percentage) {
    const value = (percentage * width) / 100;
    return Math.round(value);
}

const entryBorderRadius = 8;



const CARD_WIDTH = wp(45);
const CARD_HEIGHT = height * 0.3;
const sliderWidth = width;
const itemHorizontalMargin = wp(2);

class TopListCard extends React.Component{


    get image (){
        const { marker } = this.props;
        return(
            <Image
                source={{ uri: marker.information.previewImage}}
                style={styles.image}
            />
        )

    }

    render(){
        const { marker, openDetail,index  } = this.props
        return (
            <TouchableOpacity
                activeOpacity={1}
                style={[styles.cardInnerContainer, {marginLeft: this.props.isFirst ? 15: 0}]}
                onPress={() => openDetail(index)}>
                
                <View style={styles.shadow} />
                    <View style={styles.imageContainer}>
                        <Image
                                source={{ uri: marker.information.previewImage}}
                                style={styles.image}
                            />
                        <View style={styles.radiusMask} />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title} numberOfLines={1}>
                            { marker.information.name }
                        </Text>
                    </View>
                </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    card: {
        padding: 10,
        elevation: 2,
        shadowColor: "#000",
        backgroundColor:'rgba(30, 139, 195, 0.5)',
        borderRadius:20,
        shadowRadius: 2,
        shadowOpacity: 0.1,
        shadowOffset: { x: 2, y: -2 },
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: "hidden",
        
      },
      image: {
        ...StyleSheet.absoluteFillObject,
        width:'auto',
        height:CARD_HEIGHT - 80,
        resizeMode: 'cover',
        // borderRadius: entryBorderRadius,
       
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius,
        overflow:'hidden'
    },
    imageContainer: {
        flex: 1,
        marginBottom:  0,
        backgroundColor: 'white',
        overflow:'hidden',
        borderTopLeftRadius: entryBorderRadius,
        borderTopRightRadius: entryBorderRadius
    },
      shadow: {
        position: 'absolute',
        top: 0,
        left: itemHorizontalMargin,
        right: itemHorizontalMargin,
        bottom: 18,
        shadowColor: 'black',
        shadowOpacity: 0.25,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        borderRadius: entryBorderRadius,
        backgroundColor:'white'
    },
      cardInnerContainer:{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        paddingHorizontal: itemHorizontalMargin,
        paddingBottom: 18 // needed for shadow,
        
      },
      blurContainer:{
        justifyContent:'center',
        alignItems:'center',
        borderRadius:20
      },
      textContainer: {
        justifyContent: 'center',
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderBottomLeftRadius: entryBorderRadius,
        borderBottomRightRadius: entryBorderRadius
    },
    title: {
        color:'black',
        fontSize: 13,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        fontFamily:'ProductSans-Regular'
    },
});

  export default TopListCard;