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
  FlatList,
  TouchableOpacity
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { get } from 'lodash';
import { SearchBar, ListItem } from 'react-native-elements';
import { connect } from 'react-redux'
import { pushTutorialScreen } from 'src/navigation';
import TopList from 'src/components/TopList';
import { bindActionCreators } from "redux";
import {  markersActionCreators, userActions } from 'src/redux';
import EventEmitter from 'EventEmitter';
import firebase from 'react-native-firebase'
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
    backgroundColor:'white',
    elevation: 9,
  },
  
});

class ListScreen extends PureComponent {

  constructor(props) {
    super(props);

    Navigation.events().bindComponent(this);
    this.state={
      search: '',
      isSearching: false
    }
    this.firebaseRef = firebase.firestore().collection('badlocations').where("feature.properties.KMN_NAMN", "==", "Stockholm")

    


    

    this.events = new EventEmitter();
    this.events.addListener('navigateToMapMarker', (marker, index) => this.navigateToMapMarker(marker, index) );
  }

  componentDidMount(){

    this.unsubscribe = this.firebaseRef.onSnapshot(this.onCollectionUpdate) 


   // this.unsubscribe = this.firebaseRef.onSnapshot(this.onCollectionUpdate, (err) => console.log(error))
    const user = firebase.auth().currentUser
 
    this.userSubsribe = firebase.firestore().collection('users').doc(user.toJSON().uid).onSnapshot(this.onUserUpdate) 
    // const httpsCallable = firebase.functions().httpsCallable('testing');

    // httpsCallable()
    //   .then((data) => {
    //       console.log(data); // hello world
    //   })
    //   .catch(httpsError => {
    //       console.log(httpsError); // invalid-argument
        
    //   })
    this.props.actions.openFromList(false)

    
  }
  onUserUpdate = (querySnapshot) =>{
    const userData = [];
    if(querySnapshot.data()){
      const data = querySnapshot.data()
      this.props.userActions.updateUserData(data)
    }
    // this.props.actions.receivedBadplatser(markers)
  }

  onCollectionUpdate = (querySnapshot) =>{
    console.log(querySnapshot)
    const markers = [];
    querySnapshot.forEach((doc) => {
      console.log(doc)
      const { baddetail, feature, detail } = doc.data()
      let o = {
        id: feature.id,
        location:{
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1]
        },
        information:{
          name: baddetail.name,
          previewImage: 'https://dansglad.se/ute/arkiv/141203/141203_tenntorp-fixksatra_0027.jpg',
          upvotes:0,
          temperatur: 14
        },
        detail,
        baddetail
      }
      markers.push(o)
      
    });
    this.props.actions.receivedBadplatser(markers)
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  

  navigateToMapMarker = (marker, index) => {
    //set some marker stuff with redux
    // console.log("heeeeey marker")
    this.props.actions.openFromList(true)
    this.props.actions.setSelectedBadPlats(index)
    Navigation.mergeOptions(this.props.componentId, {
      bottomTabs: {
        currentTabIndex: 1
      }
    });
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
    this.setState({search})
  }


  _renderSearchListItem = ({item, index}) => {
    return(
      <TouchableOpacity onPress={() => this.openDetail(item, index)}>
        <ListItem
            containerStyle={{backgroundColor:'transparent'}}
            key={item.id}
            bottomDivider={true}
            title={item.information.name} />   
      </TouchableOpacity>

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
          keyboardShouldPersistTaps={'handled'}

          keyExtractor={(item, index) => item.id}
          renderItem={this._renderSearchListItem}
      />
    )
  }

  onCancel = () => {
    //this.ref.blur()
    this.setState({search: '', isSearching: false})
    
  }
  onClear = () => {
    // console.log("onClear")
  }
  onBlur = () => {
    //this.ref.cancel()
  }

  handleFocus = () => {
    if(!this.state.isSearching){
      this.setState({isSearching: true})
    }
    else if(this.state.isSearching && this.state.search > 0){
      this.setState({isSearching: false})
    }
    else{
      
    }
  }

  openDetail = async(marker, index) =>{
    this.props.actions.openFromList(false)
    Navigation.showModal({
      stack: {
        children: [{
          component: {
            name: 'demo.BadDetailScreen',
            passProps: {
              marker: marker,
              events:this.events,
              cameFromList: true,
              index: index
            },
            options: {
              topBar: {
                visible:false
              }
            }
          }
        }]
      }
    });

  }
  

  render() {
    // console.log(this.state.isSearching)
    const { search, isSearching } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
        <ScrollView stickyHeaderIndices={[1]} keyboardShouldPersistTaps={'handled'} >

        
        
          <View style={{alignItems:'center', marginTop: 20, paddingHorizontal:26 }}>
            <Text style={{fontSize: 30, fontWeight:'bold'}}>Sök efter en badplats! 🏊‍</Text>
          </View>
        
        <View style={{alignItems:'center', marginVertical: 10, backgroundColor:'rgba(240, 250, 252, 1)'}}>
          <SearchBar
            lightTheme={true}
            
            platform='ios'
            onFocus={this.handleFocus}
            onBlur={this.onBlur}
            onClear={this.onClear}
            ref={(ref) => this.ref = ref}
            onCancel={this.onCancel}
            cancelButtonTitle="Sluta sök"
            inputContainerStyle={{backgroundColor:'white'}}
            
            containerStyle={[styles.searchBarShadow, {width: wp(90), backgroundColor:'transparent'}]}
            placeholder="Skriv här..."
            
            onChangeText={this.updateSearch}
            value={search}
          />
        </View>

     

        {!isSearching  ? 
        
        <View>
          <TopList
          onDetailOpen={this.openDetail}
          badmarkers={this.props.markers.markers} 
          title="Mest populära badplatser"
          />

          <TopList
            onDetailOpen={this.openDetail}
            badmarkers={this.props.markers.markers} 
            title="Dina favoriter"
          />

          <TopList
            onDetailOpen={this.openDetail}
            badmarkers={this.props.markers.markers} 
            title="Varmast idag"
          />
        </View> : 
        <View style={{paddingLeft:15, paddingRight:15}}>
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
const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    actions: bindActionCreators(markersActionCreators, dispatch),
    userActions: bindActionCreators(userActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListScreen);
