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
  };

  render() {
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

    return (
      <Container onPress={onPress}>
        <ImageBackground
          source={image}
          style={[styles.container, { width: imageSize, height: imageSize }]}
          imageStyle={[
            {
              marginBottom,
              marginRight,
            },
          ]}
        >
          {this.renderContent()}
        </ImageBackground>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    resizeMode: 'cover',
    alignItems: 'flex-end',
  },
  buttonIcon: {
    marginHorizontal: 10,
    marginVertical: 5,
  },
  unselectedCheck: {
    opacity: 0.3,
  },
});

export default GalleryItem;
