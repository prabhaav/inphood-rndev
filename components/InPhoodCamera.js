/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
 /* @flow */

'use strict';

import React, { Component } from "react";
import {AppRegistry, StyleSheet, Text, TextInput, TouchableHighlight, View, Image} from "react-native";

import Icon from 'react-native-vector-icons/Ionicons';

import Camera from 'react-native-camera'
var InPhoodLibrary = require('./InPhoodLibrary');

class InPhoodCamera extends Component {
  constructor(props) {
    super(props);
    // From: https://facebook.github.io/react/docs/reusable-components.html#no-autobinding
    this._takePicture = this._takePicture.bind(this);
    this._handleBackPage = this._handleBackPage.bind(this);
    this._handleFwdPage = this._handleFwdPage.bind(this);

    this.state = {
      cameraType: Camera.constants.Type.back,
      photo: '',
    };
  }

  _takePicture() {
    this.refs.cam.capture(function(err, data) {
      if (data) {
        this.setState({
          photo: data,
        });
          // console.log('\n\n\n Camera Data')
        this.props.navigator.push({
          title: 'Collage',
          component: InPhoodLibrary,
          passProps: {
            token: this.props.token,
            id: this.props.id,
            profile: this.props.profile,
            photo: this.state.photo,
            image: this.props.image,
            caption: this.props.caption,
            name: this.props.name,
            gender: this.props.gender,
          }
        });
      }
      else {
        alert('Camera Error!');
      }
    }.bind(this));
  }

  _handleBackPage() {
    this.props.navigator.pop();
  }

  _handleFwdPage() {
    this.props.navigator.push({
      title: 'Collage',
      component: InPhoodLibrary,
      passProps: {
        token: this.props.token,
        id: this.props.id,
        profile: this.props.profile,
        photo: this.state.photo,
        image: this.props.image,
        caption: this.props.caption,
        name: this.props.name,
        gender: this.props.gender,
      }
    });
  }

  render() {
    return (
        <Camera
          ref="cam"
          style={styles.container}
          type={this.state.cameraType}>

          <View style={styles.quarterHeightContainer}/>
          <View style={styles.quarterHeightContainer}/>
          <View style={styles.quarterHeightContainer}/>

          <View style={styles.quarterHeightContainer}>

            {/*Placeholder to match buttonbar height in start/login page.*/}
            <View style={{height:60}}/>

            <View style={styles.buttonRowStyle}>

              <TouchableHighlight onPress={this._handleBackPage}>
                <Icon
                  name="ios-person"
                  size={45}
                  color="#3b5998"
                  style={styles.marginStyle}
                />
              </TouchableHighlight>

              {/* Outer view is  circular shutter outline that is not animated as per Apple, by TouchableHighlight. */}
              <View style={styles.shutterOuterViewStyle}>
                <TouchableHighlight style={styles.shutterInnerViewStyle} onPress={this._takePicture.bind(this)}>
                  {/*Empty view needed as child for TouchableHighlight ...*/}
                  <View/>
                </TouchableHighlight>
              </View>


              <TouchableHighlight onPress={this._handleFwdPage}>
                <Icon
                  name="ios-photos"
                  size={45}
                  color="#3b5998"
                  style={styles.marginStyle}
                />
              </TouchableHighlight>

            </View>

          </View>
        </Camera>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  quarterHeightContainer: {
    flex: 0.25,
    alignItems: 'center',
  },
  buttonRowStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  marginStyle: {
    margin: 5,
  },
  shutterInnerViewStyle: {
    marginTop: 5,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#3b5998',
  },
  shutterOuterViewStyle: {
    marginTop: 5,
    marginBottom: 5,
    marginRight: 35,
    marginLeft: 35,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'center',
  }
});

module.exports = InPhoodCamera;
