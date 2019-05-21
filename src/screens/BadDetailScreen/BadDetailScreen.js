import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  FlatList
} from "react-native";
import { Image } from "react-native-elements";
import { Navigation } from "react-native-navigation";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import ImageViewer from "react-native-image-zoom-viewer";
import HeaderImageScrollView, {
  TriggeringView
} from "react-native-image-header-scroll-view";
import Icon from "react-native-vector-icons/FontAwesome";
import { connect } from "react-redux";
import { userActions } from "../../redux/modules/user/actions";
import { bindActionCreators } from "redux";
import firebase from "react-native-firebase";
import * as _ from "lodash";
const window = Dimensions.get("window");

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

class BadDetailScreen extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state = {
      index: 0,
      modalVisible: false,
      isFavorited: false,
      isLiked: false,
      selectedImageIndex: 0,
      upvotes: "",
      dataSource: {}
    };

    this.upvoteRef = firebase
      .firestore()
      .collection("upvotes")
      .doc(props.marker.id);
  }
  async componentDidMount() {
    Navigation.mergeOptions(this.props.componentId, {
      statusBar: {
        style: "light"
      },
      topBar: {
        visible: false,
        leftButtons: [
          {
            id: "detail_done",
            systemItem: "done",
            color: "black"
          }
        ]
      }
    });

    this.upvoteRef.onSnapshot(docSnapshot => {
      if (docSnapshot.exists) {
        const { upvotes } = docSnapshot.data();
        this.setState({ upvotes });
      }
    });

    var that = this;
    let items = Array.apply(null, Array(3)).map((v, i) => {
      return { id: i, src: "http://placehold.it/200x200?text=" + (i + 1) };
    });
    that.setState({
      //Setting the data source
      dataSource: items
    });
  }

  navigationButtonPressed({ buttonId }) {
    const { data } = this.props;

    switch (buttonId) {
      case "detail_done": {
        Navigation.dismissModal(this.props.componentId);
        //pushTutorialScreen();
        break;
      }
      default:
        break;
    }
  }

  navigateToMarkerMap = () => {
    Navigation.dismissModal(this.props.componentId);
    this.props.events.emit(
      "navigateToMapMarker",
      this.props.marker,
      this.props.marker.originalIndex
    );
  };

  componentDidUpdate(oldProps) {}

  addToFavorites = () => {
    const { actions, marker, user } = this.props;
    let isFavorited = user.favorites.indexOf(marker.id) != -1;
    if (isFavorited) {
      //remove from favorites
      actions.removeFromFavorites(this.props.marker.id);
    } else {
      //add to favorites
      actions.addToFavorites(this.props.marker.id);
    }
    // this.setState({isFavorited:!this.state.isFavorited})
  };

  addToUpvoted = () => {
    const { actions, marker, user } = this.props;
    let isUpvoted = user.upvoted.indexOf(marker.id) != -1;
    if (isUpvoted) {
      //remove from favorites
      actions.removeFromUpvoted(this.props.marker.id);
    } else {
      //add to favorites
      actions.addToUpvotes(this.props.marker.id);
    }
    // this.setState({isFavorited:!this.state.isFavorited})
  };

  renderUserPictures = () => {
    let images = [];
    this.props.marker.information.images.slice(1).map(url => images.push({ url }));

    return (
      <React.Fragment>
        <FlatList
          data={this.props.marker.information.images.slice(1)}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => this.setState({ modalVisible: true, selectedImageIndex: index })}
              style={{ flex: 1, flexDirection: "column", margin: 1 }}
            >
              <Image style={styles.imageThumbnail} source={{ uri: item }} />
            </TouchableOpacity>
          )}
          //Setting the number of column
          numColumns={2}
          keyExtractor={(item, index) => index}
        />
        <Modal
          visible={this.state.modalVisible}
          transparent={true}
          onRequestClose={() => this.setState({ modalVisible: false })}
        >
          <ImageViewer
            index={this.state.selectedImageIndex}
            imageUrls={images}
            enableSwipeDown={true}
            onSwipeDown={() => {
              this.setState({ modalVisible: false });
            }}
          />
        </Modal>
      </React.Fragment>
    );
  };

  render() {
    const default_images = [
      {
        url: this.props.marker.information.images[0]
      },
      {
        url: this.props.marker.information.images[0]
      }
    ];
    const { marker, user } = this.props;
    let isFavorited = user.favorites.indexOf(marker.id) != -1;
    let isUpvoted = user.upvoted.indexOf(marker.id) != -1;
    const images = marker.information.images
      ? marker.information.images
      : default_images;
    let summary = null;
    let quality = null;
    if (marker.baddetail.summary) {
      summary = marker.baddetail.summary;
    }
    if (marker.detail && marker.detail.qualityRating) {
      quality = marker.detail.qualityRating[1].ratingText;
    }

    let userPics = this.renderUserPictures();

    return (
      <HeaderImageScrollView
        minOverlayOpacity={0}
        maxOverlayOpacity={0}
        maxHeight={200}
        minHeight={0}
        useNativeDriver={true}
        headerImage={{ uri: marker.information.images[0] }}
        renderForeground={() => (
          <TouchableOpacity
            style={{
              height: 200,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              onPress={() => Navigation.dismissModal(this.props.componentId)}
              style={styles.backButton}
            >
              <Icon
                name="chevron-left"
                size={30}
                color="white"
                style={styles.close}
              />

              {/* <Text style={{fontWeight: 'bold', color:'black', fontSize: 15}}> Go back</Text> */}
            </TouchableOpacity>
            <View style={styles.upvotes}>
              <Text style={{ color: "#1967d2", fontWeight: "bold" }}>
                {" "}
                {this.state.upvotes} har gillat denna badplats
              </Text>
            </View>
          </TouchableOpacity>
        )}
      >
        <View style={styles.customRadius} />

        <View style={styles.scrollContent}>
          <TriggeringView>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: window.width,
                backgroundColor: "transparent"
              }}
            >
              <TouchableOpacity
                style={styles.titleContainer}
                onPress={() =>
                  this.props.cameFromList && this.navigateToMarkerMap()
                }
              >
                <Text numberOfLines={2} style={styles.titleStyle}>
                  {marker.information.name}
                </Text>
                <Text>
                  {" "}
                  <Text style={{ fontWeight: "bold" }}>Lat:</Text>{" "}
                  {marker.location.latitude.toFixed(4)}{" "}
                  <Text style={{ fontWeight: "bold" }}>Long:</Text>{" "}
                  {marker.location.longitude.toFixed(4)}{" "}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.socialContainer}>
              <TouchableOpacity
                onPress={this.addToFavorites}
                style={styles.socialButton}
              >
                <Text
                  style={[
                    styles.socialText,
                    {
                      fontFamily: isFavorited
                        ? "ProductSans-Bold"
                        : "ProductSans-Regular"
                    }
                  ]}
                >
                  {isFavorited
                    ? "Tillagd i favoriter"
                    : "Lägg till i favoriter"}
                </Text>
                <Icon
                  name={isFavorited ? "star" : null}
                  size={20}
                  color="#1967d2"
                  style={{ marginLeft: 0 }}
                  light
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={this.addToUpvoted}
                style={styles.socialButton}
              >
                <Text
                  style={[
                    styles.socialText,
                    {
                      fontFamily: isUpvoted
                        ? "ProductSans-Bold"
                        : "ProductSans-Regular"
                    }
                  ]}
                >
                  {isUpvoted ? "Gillar badplats" : "Gilla badplats"}
                </Text>
                <Icon
                  name={isUpvoted ? "thumbs-up" : null}
                  size={20}
                  color="#1967d2"
                  style={{ marginLeft: 0 }}
                  light
                />
              </TouchableOpacity>
            </View>

            <View style={styles.locationDesc}>
              <Text style={styles.descTitle} numberOfLines={5}>
                {summary}
              </Text>
            </View>

            <View style={styles.pictureStyles}>
              <Text style={styles.pictureHeader}> Bilder på badplatsen</Text>
              <View style={styles.picsContainer}>
                {this.renderUserPictures()}
              </View>
            </View>
          </TriggeringView>
        </View>
      </HeaderImageScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden"

    // justifyContent:'center',
    // alignItems:'center',
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 10,
    paddingVertical: 10
  },
  pictureStyles: {
    marginTop: 30,
    flex: 1,
    width: window.width,
    justifyContent: "center",
    flexDirection: "column"
  },
  picsContainer: {
    justifyContent: "center",
    flex: 1,
    paddingTop: 20
  },
  pictureHeader: {
    fontFamily: "ProductSans-Bold",
    fontSize: 30,
    textAlign: "center"
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center"
  },
  imageThumbnail: {
    justifyContent: "center",
    alignItems: "center",
    height: 200
  },
  socialText: {
    fontFamily: "ProductSans-Regular",
    marginRight: 5,
    fontSize: 17
  },
  locationDesc: {
    width: window.width,
    marginLeft: 0,
    marginTop: 20,
    paddingHorizontal: 20,
    alignItems: "center"
  },
  upvotes: {
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "rgba(255,255,255, .9)",
    fontFamily: "ProductSans-Regular"
  },
  descTitle: {
    fontSize: 15,
    fontFamily: "ProductSans-Regular"
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    width: window.width,
    height: PARALLAX_HEADER_HEIGHT
  },
  titleStyle: {
    backgroundColor: "transparent",
    color: "#1967d2",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
    fontFamily: "ProductSans-Regular"
  },
  titleContainer: {
    backgroundColor: "#e8f0fe",
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 20,
    width: window.width - 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",

    paddingBottom: 20
  },
  scrollContent: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "flex-start"
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 10,
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 1.25,
    shadowRadius: 3.84
  },
  customRadius: {
    height: 70,
    position: "absolute",
    top: -10,
    backgroundColor: "white",
    left: -3,
    right: 3,
    width: window.width + 6,
    zIndex: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -10
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.84,

    elevation: 5
  }
});

const mapStateToProps = (state, props) => {
  const { user, markers } = state;
  let markerIndex = markers.markers
    .map(function(x) {
      return x.id;
    })
    .indexOf(props.markerId);
  const marker = markers.markers[markerIndex];
  return {
    user,
    marker: marker
  };
};
const mapDispatchToProps = dispatch => {
  return {
    // dispatching plain actions
    actions: bindActionCreators(userActions, dispatch)
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BadDetailScreen);
