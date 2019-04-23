import React, { Component } from 'react'
import {
    Text, 
    View,
    ScrollView,
    StyleSheet,
    Dimensions, FlatList
} from 'react-native'

import Carousel, { Pagination, getInputRangeFromIndexes } from 'react-native-snap-carousel';
import TopListCard from './TopListCard'

const { width, height } = Dimensions.get("window");


function wp (percentage) {
    const value = (percentage * width) / 100;
    return Math.round(value);
}


const CARD_WIDTH = wp(40);
const CARD_HEIGHT = height * 0.36;
const sliderWidth = width;


class TopList extends Component{


    _renderCardItem = ({item, index}) => {
        let isFirst = false;
        
        return <TopListCard marker={item} isFirst={index == 0}index={index} key={item.id} openDetail={this.openDetail}/>
      }

    renderCards = ()=> {
        const { badmarkers } = this.props
        return (
            <View style={styles.listContainer}>
                <FlatList
                ref={(ref) => this.cardListRef = ref}
                data={badmarkers}
                keyExtractor={(item, index) => item.id}
               
                horizontal={true}
                renderItem={this._renderCardItem}
                />
                </View>
                  
        )
      }

    render(){
        console.log(this.props)
        return(
            <View style={styles.container}>

                <Text style={styles.title}>
                    {this.props.title}
                </Text>

                {this.renderCards()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        marginVertical:10, 
        justifyContent:'flex-start',
        marginLeft: 0,    
    },
    listContainer:{
        paddingTop: 15

    },
    title:{
        fontWeight:'bold',
        color:'black',
        fontSize: 20,
        marginLeft: 30
    },
    card: {
        padding: 10,
        elevation: 2,
        marginHorizontal: 0,
        shadowColor: "#000",
        borderRadius:20,
        shadowRadius: 5,
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
        marginTop: 0,
        overflow: 'visible', // for custom animations,
      },
      sliderContentContainer: {
        paddingVertical: 0 // for custom animation
      },
})


export default TopList;