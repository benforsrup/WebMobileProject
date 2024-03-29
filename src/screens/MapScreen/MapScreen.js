import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import EventEmitter from "EventEmitter";
import { StyleSheet, View, Text, Alert, Dimensions } from "react-native";
import { Navigation } from "react-native-navigation";
import { get } from "lodash";
import Map from "./Map";
import { pushTutorialScreen } from "src/navigation";
import { connectData, markersActionCreators } from "src/redux";
import { applyThemeOptions } from "../../styling";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Overlay, Button } from "react-native-elements";
import Modal from "react-native-modal";
import { DetailOverlay } from "./DetailOverlay";
import firebase from "react-native-firebase";

const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;

class MapScreen extends PureComponent {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state = {
      detailIsOpen: false
    };
    this.events = new EventEmitter();
    this.events.addListener("closeDetail", () =>
      this.setState({ detailIsOpen: false })
    );

    this.unsubscribe = null;
  }

  // static get options() {
  //   // return applyThemeOptions({
  //   // });
  // }

  componentDidMount() {
    //fetch markers
    // this.props.actions.requestBadplatser()
  }


  openDetail = async (marker, index) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: "demo.BadDetailScreen",
              passProps: {
                index,
                markerId: marker.id
              },
              options: {
                topBar: {
                  title: {
                    text: marker.information.name
                  }
                }
              }
            }
          }
        ]
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Map
          favorites={this.props.user.favorites}
          openedFromList={this.props.markers.openedFromList}
          selectedMarkerIndex={this.props.markers.selectedIndex}
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white"
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "column",
    justifyContent: "flex-end",
    flex: 1
  },
  detailContainerStyle: {
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: height - 300,
    marginBottom: 0,
    padding: 0,
    flex: 0
  },

  detailModalStyle: {
    justifyContent: "center",
    margin: 0,
    alignItems: "center",
    backgroundColor: "green",
    width: width,
    height: 300,
    borderRadius: 30
  }
});

// Tab1Screen.propTypes = {
//   data: PropTypes.shape({}).isRequired
// };

function mapStateToProps(state) {
  const { data, markers, user } = state;
  return {
    data: data,
    markers: markers,
    user
  };
}
const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    actions: bindActionCreators(markersActionCreators, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapScreen);
