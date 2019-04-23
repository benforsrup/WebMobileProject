// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  Alert,
  SafeAreaView,
  ScrollView,
  Dimensions,
  FlatList
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { get } from 'lodash';
import { SearchBar, ListItem } from 'react-native-elements';
import { connect } from 'react-redux'
import { pushTutorialScreen } from 'src/navigation';
import { connectData } from 'src/redux';
import TopList from './TopList';
import { bindActionCreators } from "redux";

const { width, height } = Dimensions.get("window");


function wp (percentage) {
    const value = (percentage * width) / 100;
    return Math.round(value);
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'rgba(240, 250, 252, 1)'
  },
  searchBarShadow:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,

    elevation: 9,
  },
  
});

class Tab2Screen extends PureComponent {

  constructor(props) {
    super(props);

    Navigation.events().bindComponent(this);
    this.state={
      search: '',
      isSearching: false
    }
  }

  navigationButtonPressed({ buttonId }) {
    const { data } = this.props;

    switch (buttonId) {
      case 'nav_logout_btn': {
        pushTutorialScreen();
        break;
      }
      case 'nav_user_btn': {
        Alert.alert(get(data, 'user.name', 'Unknown User'));
        break;
      }
      default:
        break;
    }
  }

  updateSearch = (search) => {
    let isSearching = false;
    if(search.length > 0 ){
      isSearching = true
    }
    this.setState({search, isSearching})
  }


  _renderSearchListItem = ({item, index}) => {
    return(
        <ListItem
            containerStyle={{backgroundColor:'transparent'}}
            key={index}
            bottomDivider={true}

            title={item.information.name} />   

    )
  }
  renderSearchList = () => {

    let filteredBadplatser = this.props.markers.markers
    filteredBadplatser = filteredBadplatser.filter((plats) => {
      let platsnamn = plats.information.name.toLowerCase()
      return platsnamn.indexOf(
        this.state.search.toLowerCase()) !== -1
    })
    return (
      <FlatList
          data={filteredBadplatser}
          keyExtractor={(item, index) => index}
          renderItem={this._renderSearchListItem}
      />
    )
  }

  onCancel = () => {
    this.setState({search: '', isSearching: false})
  }
  

  render() {
    console.log(this.state.isSearching)
    const { search, isSearching } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
        <ScrollView >

        { !isSearching && 
          <View style={{alignItems:'center', marginTop: 20, paddingHorizontal:26 }}>
            <Text style={{fontSize: 30, fontWeight:'bold'}}>Sök efter en badplats! 🏊‍</Text>
          </View>
        }
        <View style={{alignItems:'center', marginVertical: 10}}>
          <SearchBar
            lightTheme={true}
            platform='ios'
            ref={(ref) => this.ref = ref}
            onCancel={() => this.onCancel()}
            inputContainerStyle={{backgroundColor:'white'}}
            containerStyle={[styles.searchBarShadow, {width: wp(90), backgroundColor:'transparent'}]}
            placeholder="Type Here..."
            onChangeText={this.updateSearch}
            value={search}
          />
        </View>

        {!isSearching  ? 
        
        <View>
          <TopList
          badmarkers={this.props.markers.markers} 
          title="Mest populära badplatser"
          />

          <TopList
            badmarkers={this.props.markers.markers} 
            title="Dina favoriter"
          />

          <TopList
            badmarkers={this.props.markers.markers} 
            title="Varmast idag"
          />
        </View> : <View style={{paddingLeft:15, paddingRight:15}}>
        {this.renderSearchList()}
          </View>
      }

        </ScrollView>

        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  const { data, markers } = state
  return  {
    data: data,
    markers: markers
  }
}


export default connect(mapStateToProps, null)(Tab2Screen);
