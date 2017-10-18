import React, { PureComponent } from 'react';
import {
  View,
  FlatList,
  Dimensions,
  StyleSheet,
  Easing,
  Animated,
} from 'react-native';

import GalleryItem from './GalleryItem';

const { width } = Dimensions.get('window');

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class GalleryList extends PureComponent {
  constructor(props) {
    super(props);

    const { imageMargin, imagesPerRow } = props;

    this.state = {
      imageSize: width / imagesPerRow,
    };
  }

  handleOnPressImage = ({ index }) => (event) =>
    this.props.onPressImage(index, event);

  renderItem = (row) => {
    const { imageSize } = this.state;
    const { type, imageMargin, imagesPerRow, selectedImages } = this.props;

    return (
      <GalleryItem
        {...row.item}
        isSelected={selectedImages.includes(row.index)}
        type={type}
        imageSize={imageSize}
        marginBottom={imageMargin}
        marginRight={(row.index + 1) % imagesPerRow !== 0 ? imageMargin : 0}
        onPress={this.handleOnPressImage(row)}
      />
    );
  };

  render() {
    const { data, imagesPerRow, animated, ...props } = this.props;

    const passedProps = {
      data,
      renderItem: this.renderItem,
      keyExtractor: item => item.id,
      contentContainerStyle: styles.container,
      numColumns: imagesPerRow,
      ...props,
    }

    if (animated) {
      return (
        <AnimatedFlatList {...passedProps} />
      );
    }

    return (
      <FlatList {...passedProps} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    flexDirection: 'column',
  },
});

export default GalleryList;
