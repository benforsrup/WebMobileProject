import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text
} from 'react-native';
import {Navigation } from 'react-native-navigation'
import { connect } from 'react-redux';
class TopBarBackground extends Component {

  constructor(props) {
    super(props);
    this.subscription = Navigation.events().bindComponent(this);
    this.state = {};
    this.dots = new Array(55).fill('').map((ignored, i) => <View key={'dot' + i} style={[styles.dot, {backgroundColor: "#EDED4D"}]}/>);
  }

  componentDidAppear() {
  }

  componentDidDisappear() {
  }

  componentDidMount() {
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}> {this.props.markers.testing} </Text>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    markers: state.markers
  }
}

export default connect(mapStateToProps,null)(TopBarBackground)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent:'center',
    alignItems:'center',
  },
  title:{
      fontSize:30,
      fontWeight:'bold'
  },
  dot: {
    height: 16,
    width: 16,
    borderRadius: 8,
    margin: 4
  }
});