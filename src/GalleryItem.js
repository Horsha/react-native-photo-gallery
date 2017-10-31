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
  state = {
    isImageBroken: false,
  };

  handleBrokenImage = (event) => {
    this.props.onImageError(event);

    this.setState({
      isImageBroken: true,
    });
  };

  renderContent = () => {
    const { type, isSelected } = this.props;
    
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

    if (type === 'delete') {
      return (
        <Image
          source={require('./assets/close.png')}
          style={styles.buttonIcon}
        />
      );
    }
  };

  render() {
    const { isImageBroken } = this.state;
    const {
      type,
      image,
      imageSize,
      marginBottom,
      marginRight,
      onPress,
    } = this.props;

    const Container = ['select', 'delete'].includes(type) ?
      TouchableOpacity :
      TouchableWithoutFeedback;

    if (isImageBroken) {
      return (
        <Container onPress={event => onPress(event, { isImageBroken })}>
          <ImageBackground
            source={require('./assets/broken-image.png')}
            style={[
              styles.container,
              styles.brokenImageContainer,
              {
                width: imageSize - 1,
                height: imageSize - 1,
                marginBottom,
                marginRight,
              },
            ]}
            imageStyle={[
              styles.image,
              styles.brokenImage,
              {
                marginTop: imageSize / 4,
                marginLeft: imageSize / 4,
              },
            ]}
          >
            {this.renderContent()}
          </ImageBackground>
        </Container>
      )
    }

    return (
      <Container onPress={onPress}>
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
