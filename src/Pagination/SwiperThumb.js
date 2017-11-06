import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Image } from 'react-native';

class SwiperThumb extends Component {
  goToSlide = () =>
    this.props.navigate(this.props.index);

  render() {
    const {
      isImageBroken,
      data,
      active,
      index,
    } = this.props;

    const image = isImageBroken ?
      require('../assets/broken_image.png') :
      (data[index].thumb || data[index].image);

    return (
      <TouchableOpacity
        style={styles.container}
        onPress={this.goToSlide}
      >
        <Image
          style={[
            styles.thumb, 
            {
              opacity: active ? 1 : 0.6
            }
          ]}
          source={image}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: 64,
    justifyContent: 'center',
    alignItems: 'center',
    height: 64,
  },
  thumb: {
    width: 64,
    height: 64,
  }
});

export default SwiperThumb;
