/* @flow */

'use strict';

import React, { Component } from "react";
import {AppRegistry, StyleSheet, Text, TextInput, TouchableHighlight, View, Image} from "react-native";

import Icon from 'react-native-vector-icons/Ionicons';
import { RNS3 } from 'react-native-aws3';
var InPhoodCollage = require('./InPhoodCollage');

class InPhoodImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      caption: '',
      imageName: '',
      media: [],
    };
    this._handleBackPage = this._handleBackPage.bind(this);
    this._handleFwdPage = this._handleFwdPage.bind(this);
    this.updateText = this.updateText.bind(this);
  }

  componentDidMount() {}

  _handleBackPage() {
    this.props.navigator.pop();
  }

  _handleFwdPage() {
    let data = []
    let urlHead = 'https://dqh688v4tjben.cloudfront.net/data/'
    let imageRef = firebase.database().ref(this.props.id + '/userdata')
    imageRef.orderByKey().on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        let photo = urlHead+childSnapshot.val().file_name
        let caption = childSnapshot.val().caption
        let obj = {photo,caption,false}
        data.push(obj)
      });
      // console.log('Inside')
      // console.log(data)
      this.setState({media: data}, function(){
        this.props.navigator.push({
          title: 'PhoodCollage',
          component: InPhoodCollage,
          passProps: {
            id: this.props.id,
            token: this.props.token,
            profile: this.props.profile,
            photo: this.props.photo,
            image: this.props.image,
            caption: this.state.caption,
            imageName: this.state.imageName,
            name: this.props.name,
            gender: this.props.gender,
            media: this.state.media,
          }
        })
      });
    }.bind(this));
  }

  updateText(text) {
    let text1 = text.toLowerCase();
    this.setState({
      caption: text1,
    });
    let date = Date.now();
    // let myFirebaseRef = this.props.rootRef;
    // let caption_array = text1.split(' ');
    let caption = text1
    let name = this.props.name
    let gender = this.props.gender
    let token = this.props.token
    let profile = this.props.profile
    firebase.database().ref(this.props.id + '/userinfo').set({
      name,
      gender,
      token,
      profile,
    })
    let key = firebase.database().ref(this.props.id + '/userdata').push()
    let file_name = this.props.id + '/' + key.path.o[2] + '.jpg';
    key.set({
      file_name,
      caption,
    });


    let imgfile = {
      uri: this.props.image,
      type: 'image/jpeg',
      name: file_name,
    }

    let options = {
    }

    RNS3.put(imgfile, options)
    .then(response => {
      if (response.status !== 201)
        throw new Error("Failed to upload image to S3");
    })
    .catch(err => console.log('Errors uploading: ' + err));

    let data = []
    let urlHead = 'https://dqh688v4tjben.cloudfront.net/data/'
    let imageRef = firebase.database().ref(this.props.id + '/userdata')
    imageRef.orderByKey().on('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        let photo = urlHead+childSnapshot.val().file_name
        let caption = childSnapshot.val().caption
        let obj = {photo,caption,false}
        data.push(obj)
      });
      this.setState({
        imageName: file_name,
        media: data,
      });
      this.props.navigator.push({
        title: 'PhoodCollage',
        component: InPhoodCollage,
        passProps: {
          id: this.props.id,
          token: this.props.token,
          profile: this.props.profile,
          photo: this.props.photo,
          image: this.props.image,
          caption: this.state.caption,
          imageName: this.state.imageName,
          name: this.props.name,
          gender: this.props.gender,
          media: this.state.media,
        }
      });
      // console.log(this.state)
      // this.setState({media: data})
    }.bind(this));
  }

  render() {
    return (
      <View style={styles.container}>

        <View style={styles.threeQuarterHeightContainer}>

          <View style={styles.borderStyle}>

            <Image
              style={styles.gif}
              source={{uri: this.props.image}}
            />

            <TextInput
              autoCapitalize="none"
              placeholder="Describe your meal"
              returnKeyType="done"
              onSubmitEditing={(event) => this.updateText(event.nativeEvent.text)}
              style={styles.default}
            />

          </View>

        </View>

        <View style={styles.quarterHeightContainer}>

          {/*Placeholder to match buttonbar height in start/login page.*/}
          <View style={{height:60}}/>

          <View style={styles.buttonRowStyle}>

            <TouchableHighlight
              onPress={this._handleBackPage}
              underlayColor='white'
            >
              <Icon
                name="ios-photos"
                size={30}
                color="#3b5998"
                style={styles.marginStyle}
              />
            </TouchableHighlight>

            <TouchableHighlight
              onPress={this._handleFwdPage}
              underlayColor='white'
            >
              <Icon
                name="ios-share"
                size={30}
                color="#3b5998"
                style={styles.marginStyle}
              />
            </TouchableHighlight>

          </View>

        </View>

      </View>
    );
  }
};

var styles = StyleSheet.create({
  borderStyle: {
    borderBottomColor: '#3b5998',
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
  },
  threeQuarterHeightContainer: {
    flex: 0.75,
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
  gif: {
    flex: 2,
    height: 200,
  },
  default: {
    height: 26,
    borderWidth: 0.5,
    borderColor: '#3b5998',
    flex: 1,
    fontSize: 13,
    padding: 4,
  },


});

module.exports = InPhoodImage;
