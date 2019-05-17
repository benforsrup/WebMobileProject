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
import {geoService} from '../../services'
import * as _ from 'lodash'
const { width, height } = Dimensions.get("window");


function wp (percentage) {
    const value = (percentage * width) / 100;
    return Math.round(value);
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'white'
  },
  searchBarShadow:{
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.42,
    shadowRadius: 1.22,

    elevation: 3,
  },
  
});

class ListScreen extends PureComponent {

  constructor(props) {
    super(props);

    Navigation.events().bindComponent(this);
    this.state={
      search: '',
      isSearching: false,
      closeMarkers:[],
      mostUpvoted:[]
    }
    this.firebaseRef = firebase.firestore().collection('badlocations').where("feature.properties.KMN_NAMN", "==", "Stockholm")
    this.upvoteRef = firebase.firestore().collection("upvotes").orderBy("upvotes", "desc")




    

    this.events = new EventEmitter();
    this.events.addListener('navigateToMapMarker', (marker, index) => this.navigateToMapMarker(marker, index) );
  }

  upvoteCollectionUpdate = (snapchot) => {
    let m = []
    snapchot.forEach((doc) => {
      m.push(doc.ref.id)
    });
    this.setState({mostUpvoted: m})
  }

  componentDidMount(){

    this.unsubscribe = this.firebaseRef.onSnapshot(this.onCollectionUpdate) 
    this.upvoteRefSubscribe = this.upvoteRef.onSnapshot(this.upvoteCollectionUpdate)

   // this.unsubscribe = this.firebaseRef.onSnapshot(this.onCollectionUpdate, (err) => console.log(error))
    const user = firebase.auth().currentUser
    
    this.userSubsribe = firebase.firestore().collection('users').doc(user.toJSON().uid).onSnapshot(this.onUserUpdate) 
    const closetCallable = firebase.functions().httpsCallable('getClosestCall');

    
    geoService.getCurrentLocation().then(position => {
      if (position) {
        let url = "https://us-central1-badplatser-4f321.cloudfunctions.net/getClosestRequest"
        let data ={lat:position.coords.latitude, long:position.coords.longitude, distance:10,n:10}
        fetch(url, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'cors', // no-cors, cors, *same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          headers: {
              'Content-Type': 'application/json',
              // 'Content-Type': 'application/x-www-form-urlencoded',
          },
          redirect: 'follow', // manual, *follow, error
          referrer: 'no-referrer', // no-referrer, *client
          body: JSON.stringify(data), // body data type must match "Content-Type" header
        })
      .then(response => {
        console.log(response.json().then(val => this.setState({closeMarkers:val})))
      }); // parses JSON response into native Javascript objects 
        // closetCallable({lat:position.coords.latitude, long:position.coords.longitude, distance:10,n:10})
        //   .then((data) => {
        //       console.log(data); // hello world
        //   })
        //   .catch(httpsError => {
        //       console.log(httpsError); // invalid-argument  
        //   })
        //   this.setState({
        //     curPos: {
        //       latitude: position.coords.latitude,
        //       longitude: position.coords.longitude,
        //       latitudeDelta: 0.003,
        //       longitudeDelta: 0.003,
        //     },
        // }, () => this.updateMap());
      }
    });

    
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
    let theMarkers = [];
    
    querySnapshot.forEach((doc) => {
      
      const { baddetail, feature, detail, upvotes } = doc.data()
      let o = {
        id: feature.id,
        location:{
          longitude: feature.geometry.coordinates[0],
          latitude: feature.geometry.coordinates[1]
        },
        information:{
          name: baddetail.name.replace("Mälaren, ", ""),
          previewImage: 'https://firebasestorage.googleapis.com/v0/b/badplatser-4f321.appspot.com/o/pic.jpg?alt=media&token=00baeaa0-19be-4fdf-9fca-b355d3efc412',
          upvotes:upvotes,
          temperatur: 14
        },
        detail,
        baddetail
      }
      
      theMarkers.push(o)
      
    });
    this.props.actions.receivedBadplatser(theMarkers)
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
            titleStyle={{fontFamily:'ProductSans-Regular'}}
            key={item.id}
            bottomDivider={true}
            title={item.information.name} />   
      </TouchableOpacity>

    )
  }
  renderSearchList = () => {

    let filteredBadplatser = this.props.markers
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
              markerId: marker.id,
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

  addUpvotes = () => {
    this.firebaseRef.get().then((snapchot) => {
      snapchot.forEach((doc) => {
        let r = Math.floor(Math.random() * 200) + 100
        doc.ref.update("upvotes", r)
      })
    })
  }
  

  render() {
    // console.log(this.state.isSearching)
    const { search, isSearching } = this.state
    const { user } = this.props

    const favorites = this.props.markers.filter((marker) => {
      return user.favorites.indexOf(marker.id) > -1
    })

    const closeTo = (this.props.markers.filter((marker) => {
      return this.state.closeMarkers.indexOf(marker.id) > -1
    }))

  
    const mostUpvoted = []
    this.state.mostUpvoted.forEach((row)=> {
      console.log(row)
      let o = this.props.markers.filter((marker)=> marker.id == row)
      mostUpvoted.push(o[0])
    })
    // this.state.mostUpvoted.forEach((row)=>{
    //   let o = this.props.markers.find(x => x.id = row )
    //   //console.log(row, o)

    //   //mostUpvoted.push(this.props.markers.markers.find(x => x.id = row ))
    // })
    
  

    console.log(mostUpvoted)
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
        <ScrollView stickyHeaderIndices={[1]} keyboardShouldPersistTaps={'handled'} >

        
        
          <View style={{alignItems:'center', marginTop: 20, paddingHorizontal:26 }}>
            
            <Text style={{fontSize: 30, fontFamily:'ProductSans-Regular'}}>Sök efter en badplats! 🏊‍</Text>
          </View>
        
        <View style={{alignItems:'center', marginVertical: 10, backgroundColor:'white'}}>
          <SearchBar
            lightTheme={true}
            
            platform='ios'
            onFocus={this.handleFocus}
            onBlur={this.onBlur}
            onClear={this.onClear}
            ref={(ref) => this.ref = ref}
            onCancel={this.onCancel}
            cancelButtonTitle="Sluta sök"
            cancelButtonProps={{buttonTextStyle:{fontFamily:'ProductSans-Regular'}}}
            inputStyle={{fontFamily:'ProductSans-Regular'}}
            inputContainerStyle={{backgroundColor:'white'}}
            containerStyle={[styles.searchBarShadow, {width: wp(90), backgroundColor:'transparent'}]}
            placeholder="Skriv här..."
            
            onChangeText={this.updateSearch}
            value={search}
          />
        </View>

     

        {!isSearching  ? 
        
        <View>

          {mostUpvoted.length > 0 &&
          <TopList
          onDetailOpen={this.openDetail}
          badmarkers={mostUpvoted} 
          title="Mest gillade badplatser"
          />
          }

          {closeTo.length > 0 &&
          <TopList
          onDetailOpen={this.openDetail}
          badmarkers={closeTo} 
          title="Badplatser nära dig"
          />
          }



          <TopList
            onDetailOpen={this.openDetail}
            badmarkers={this.props.markers} 
            title="Alla badplatser"
          />

          {favorites.length > 0 &&
          <TopList
            onDetailOpen={this.openDetail}
            badmarkers={favorites} 
            title="Dina favoriter"
          />}

          
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

// let oldRender = Text.render;
// Text.render = function (...args) {
//     let origin = oldRender.call(this, ...args);
//     return React.cloneElement(origin, {
//         style: [origin.props.style, {fontFamily: 'ProductSans-Regular'}]
//     });
// };


function mapStateToProps(state) {
  const { data, markers, user } = state
  return  {
    data: data,
    markers: (markers.markers),
    user
    
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
