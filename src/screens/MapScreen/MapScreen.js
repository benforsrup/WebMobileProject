import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
  Alert
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { get } from 'lodash';
import Map from './Map'
import { pushTutorialScreen } from 'src/navigation';
import { connectData, markersActionCreators } from 'src/redux';
import { applyThemeOptions } from '../../styling'
import { bindActionCreators } from "redux";
import { connect } from 'react-redux'


const styles = StyleSheet.create({
  flex: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
    justifyContent: "flex-end"
  }
});

class MapScreen extends PureComponent {

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
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

  render() {
    console.log(this.props.markers)
    return (
      <View style={styles.container}>
          <Map />
      </View>
    );
  }
}

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
