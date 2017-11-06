import React, { PureComponent } from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import PhotoView from 'react-native-photo-view';

import Loading from './Loading';

const { width, height } = Dimensions.get('window');

export class Slide extends PureComponent {
  handleOnError = () =>
    this.props.onErrorImage(this.props.item.id);

  render() {
    const {
      showLoading,
      item: {
        overlay,
      },
      isImageBroken,
    } = this.props;

    const image = isImageBroken ? require('./assets/broken_image.png') : this.props.item.image;

    return (
      <View>
        {showLoading && <Loading />}

        <PhotoView
          source={image}
          maximumZoomScale={3}
          minimumZoomScale={1}
          androidScaleType="center"
          resizeMode="contain"
          style={styles.photoViewContainer}
          onError={this.handleOnError}
        />

        {overlay}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  photoViewContainer: {
    alignItems: 'center',
    top: -32,
    justifyContent: 'center',
    width,
    height: height - 128,
  },
});
