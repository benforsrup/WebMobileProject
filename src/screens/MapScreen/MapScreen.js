import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class MapScreen extends PureComponent {

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state={
      detailOpen: true
    }
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

   openDetail = async() =>{
      await Navigation.showOverlay({
        component: {
          name: 'custom.DetailOverlay',
          options: {
            layout: {
              componentBackgroundColor: 'transparent'
            },
            overlay: {
              interceptTouchOutside: true
            }
          }
        }
      });
    
  
  }
  backDropPress = (event) =>{
    console.log(event, "hey")
  }

  render() {
    console.log(this.props.markers)
    return (
      <View style={styles.container}>
            
          <Map onDetailOpen={this.openDetail} />
          
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
  console.log(state)
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
