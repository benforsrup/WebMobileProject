import { BlurView } from "@react-native-community/blur";
import React, { Fragment } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Marker } from "react-native-maps";
import { lightNavyBlueColor, transparent } from '../../constants/colors'
import { Dimensions, TouchableOpacity } from 'react-native'
const { width, height } = Dimensions.get("window");

const CARD_HEIGHT = height / 4;
const CARD_WIDTH = width - 20;


const DetailCard = ({marker, index, key, openDetail}) =>{

    return (
        <View style={styles.card} >
            <BlurView 
                style={[StyleSheet.absoluteFillObject, styles.blurContainer]}
                blurType="light"
                blurAmount={10} >
                <TouchableOpacity onPress={() => openDetail(index)}>
                    <Text> {marker.information.name}</Text>
                </TouchableOpacity>
            </BlurView>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        padding: 10,
        elevation: 2,
        marginHorizontal: 10,
        shadowColor: "#000",
        backgroundColor:'rgba(30, 139, 195, 0.5)',
        borderRadius:20,
        shadowRadius: 5,
        shadowOpacity: 0.3,
        shadowOffset: { x: 2, y: -2 },
        height: CARD_HEIGHT,
        width: CARD_WIDTH,
        overflow: "hidden",
        
      },
      blurContainer:{
        justifyContent:'center',
        alignItems:'center',
        borderRadius:20
      }
});

  export default DetailCard;