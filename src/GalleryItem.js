import React, { PureComponent } from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
} from 'react-native';

class GalleryItem extends PureComponent {
  handleBrokenImage = (event) =>
    this.props.onErrorImage(event, this.props.id);

  renderContent = () => {
    const { type, isSelected, allowDelete } = this.props;

    if (type === 'select') {
      return (
        <Image
          source={require('./assets/check.png')}
          style={[
            styles.buttonIcon,
            !isSelected && styles.unselectedCheck,
          ]}
        />
      );
    }

    if (type === 'delete' && allowDelete) {
      return (
        <Image
          source={require('./assets/close.png')}
          style={styles.buttonIcon}
        />
      );
    }
  };

  render() {
    const {
      type,
      imageSize,
      marginBottom,
      marginRight,
      isImageBroken,
      onPress,
      onLongPress,
    } = this.props;

    const Container = ['select', 'delete'].includes(type) ?
      TouchableOpacity :
      TouchableWithoutFeedback;

    const image = isImageBroken ? require('./assets/broken_image.png') : this.props.image;

    return (
      <Container
        onPress={onPress}
        onLongPress={onLongPress}
      >
        <ImageBackground
          source={image}
          style={[styles.container, { width: imageSize, height: imageSize }]}
          imageStyle={[
            styles.image,
            {
              marginBottom,
              marginRight,
            },
          ]}
          onError={this.handleBrokenImage}
        >
          {this.renderContent()}
        </ImageBackground>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
  },
  brokenImageContainer: {
    backgroundColor: 'white',
  },
  image: {
    resizeMode: 'cover',
  },
  buttonIcon: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  unselectedCheck: {
    opacity: 0.3,
  },
  brokenImage: {
    width: 40,
    height: 50,
  },
});

export default GalleryItem;
