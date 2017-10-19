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
            styles.image,
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
    alignItems: 'flex-end',
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
});

export default GalleryItem;
