import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import EventEmitter from 'EventEmitter'
import {
  StyleSheet,
  View,
  Text,
  Alert,
  Dimensions
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { get } from 'lodash';
import Map from './Map'
import { pushTutorialScreen } from 'src/navigation';
import { connectData, markersActionCreators } from 'src/redux';
import { applyThemeOptions } from '../../styling'
import { bindActionCreators } from "redux";
import { connect } from 'react-redux'
import { Overlay, Button } from 'react-native-elements'
import Modal from "react-native-modal";
import { DetailOverlay } from './DetailOverlay';
import firebase from 'react-native-firebase';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class MapScreen extends PureComponent {

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state={
      detailIsOpen: false
    }
    this.events = new EventEmitter();
    this.events.addListener('closeDetail', () =>  this.setState({detailIsOpen:false}) );
    this.firebaseRef = firebase.firestore().collection('badplatser')
    this.unsubscribe = null;
  }

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

  componentDidMount(){
    //fetch markers
    // this.props.actions.requestBadplatser()
    this.unsubscribe = this.firebaseRef.onSnapshot(this.onCollectionUpdate) 
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  onCollectionUpdate = (querySnapshot) =>{
    const markers = [];
    querySnapshot.forEach((doc) => {
      const { location, information } = doc.data();
      markers.push({
        location,
        information
      })  
    });
    this.props.actions.receivedBadplatser(markers)
  }

  navigationButtonPressed({ buttonId }) {
    const { data } = this.props;

    switch (buttonId) {
      case 'nav_logout_btn': {
        console.log("hey", this.props.actions)
        this.props.actions.increment()
        //pushTutorialScreen();
        break;
      }
      case 'nav_user_btn': {
        this.props.actions.decrement()
        //Alert.alert(get(data, 'user.name', 'Unknown User'));
        break;
      }
      default:
        break;
    }
  }

   openDetail = async(marker) =>{
    //  console.log("is open: ", this.state.detailIsOpen)
     
     if(!this.state.detailIsOpen){
      await Navigation.showOverlay({
        component: {
          name: 'custom.DetailOverlay',
          passProps:{
            events:this.events,
            marker: marker
          },
          options: { 
            overlay: {
              interceptTouchOutside: false
            }
          }
        }
      });
    }
      this.setState({detailIsOpen: true})

  }
  closeDetail =async() => {
    this.setState({detailOpen:false})
  }
  backDropPress = (event) =>{
    // console.log(event, "hey")
  }

  render() {
    // console.log(this.props.markers)
    return (
      <View style={styles.container}>
            
          <Map 
            onSelectMarker={this.props.actions.setSelectedBadPlats}
            onDetailOpen={this.openDetail}
            badmarkers={this.props.markers.markers}
            />
          
      </View>
    );
  }
}



const styles = StyleSheet.create({
  flex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'white'
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
    justifyContent: "flex-end",
    flex:1,
  },
  detailContainerStyle:{
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop:height -300,
    marginBottom:0,
    padding:0,
    flex:0
  },
  
  detailModalStyle:{
    justifyContent: "center",
    margin: 0,
    alignItems:'center',
    backgroundColor: 'green',
    width:width,
    height:300,
    borderRadius:30
    
  }
});

// Tab1Screen.propTypes = {
//   data: PropTypes.shape({}).isRequired
// };

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
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);
