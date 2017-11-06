import {
  Dimensions,
  FlatList,
  View,
  Animated,
  Modal,
  Image,
  TouchableWithoutFeedback,
  StyleSheet,
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Pagination, Slide, GalleryList } from './src';
import Loading from './src/Loading';

const { width, height } = Dimensions.get('window');
const ANIMATION_DURATION = 600;

export default class Gallery extends Component {
  state = {
    index: 0,
    pressEvent: {},
    brokenImages: [],
  };

  constructor(props) {
    super(props);

    const animationValue = ['list', 'select', 'delete'].includes(props.type) ? 0 : 1;

    this.scale = new Animated.Value(animationValue);
    this.pagination = new Animated.Value(animationValue);
  }

  static defaultProps = {
    type: 'preview',
    backgroundColor: '#000',
    data: [],
    imagesPerRow: 4,
    imageMargin: 1,
    initialNumToRender: 4,
    initialPaginationSize: 10,
    showCloseButton: true,
    animated: false,
    selectedImages: [],
    renderSelectorButton: this.renderSelectorButton,
    onChangeFullscreenState: () => {},
    onPressImage: () => {},
    onErrorImage: () => {},
  };

  static propTypes = {
    type: PropTypes.oneOf([
      'list', // Show list + preview
      'select', // Show list with a way to select images
      'delete', // Show list with a button to delete images
      'preview', // Show only image preview on fullscreen
    ]),
    backgroundColor: PropTypes.string,
    data: PropTypes.arrayOf((propValue, key) => {
      if (!propValue[key].id || !propValue[key].image) {
        return new Error(
          'Data prop is invalid. It must be an object containing "id" and "image" keys.'
        );
      }
    }),
    imagesPerRow: PropTypes.number,
    imageMargin: PropTypes.number,
    initialNumToRender: PropTypes.number,
    initialPaginationSize: PropTypes.number,
    showGalleryList: PropTypes.bool,
    showCloseButton: PropTypes.bool,
    onChangeFullscreenState: PropTypes.func,
    animated: PropTypes.bool,
    renderSelectorButton: PropTypes.func,
    selectedImages: PropTypes.array,
  };

  onScrollEnd = (e) => {
    const contentOffset = e.nativeEvent.contentOffset;
    const viewSize = e.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    if (pageNum !== this.state.index) {
      this.setState({ index: pageNum });
    }
  }

  getItemLayout = (data, index) => ({
    length: width,
    offset: width * index,
    index,
  });

  goTo = ({ index, animated = true, pressEvent = {} }, next) => {
    this.setState({
      index,
      pressEvent,
      visible: true,
    }, next);

    this.swiper.scrollToIndex({ index, animated });
  }

  getPosition = (type) => {
    const { size } = this.props;

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    if (type === 'top') {
      const { locationY } = this.state.pressEvent;
  
      return (-halfWidth - 200) + locationY;
    }

    const { locationX } = this.state.pressEvent;

    return (-halfWidth) + locationX;
  };

  handleOnPressImage = (row, event) => {
    const { index } = row;
    const { nativeEvent } = event;

    this.props.onPressImage(row, event);

    if (this.props.type !== 'list') {
      return;
    }

    this.props.onChangeFullscreenState(true);

    this.goTo({
      index,
      animated: false,
      pressEvent: {
        locationY: nativeEvent.pageY,
        locationX: nativeEvent.pageX,
      },
    }, () => {
      Animated.spring(this.scale, {
        toValue: 1,
        duration: ANIMATION_DURATION,
      }).start(() => this.setState({ animationFinished: true }));

      Animated.timing(this.pagination, {
        toValue: 1,
        duration: ANIMATION_DURATION - 200,
      }).start();
    });
  };

  closeImage = () => {
    this.props.onChangeFullscreenState(false);

    Animated.timing(this.scale, {
      toValue: 0,
      duration: ANIMATION_DURATION / 2,
    }).start(),

    Animated.timing(this.pagination, {
      toValue: 0,
      duration: ANIMATION_DURATION / 2,
    }).start();
  };

  handleOnErrorImage = (event, id) => {
    this.props.onErrorImage(event, id);

    this.setState(({ brokenImages }) => ({
      brokenImages: [
        ...brokenImages,
        id,
      ],
    }));
  }

  isImageBroken = id => this.state.brokenImages.includes(id);

  renderItem = (row) => (
    <Slide
      {...row}
      showLoading={!this.props.data.length}
      isImageBroken={this.isImageBroken(row.item.id)}
      onErrorImage={this.handleOnErrorImage}
    />
  );

  render() {
    const { brokenImages } = this.state;
    const {
      type,
      backgroundColor,
      data,
      initialNumToRender,
      initialPaginationSize,
      showCloseButton,
      ...rest,
    } = this.props;

    const showGalleryList = ['list', 'select', 'delete'].includes(type);
    const showPagination = ['list', 'preview'].includes(type);

    const showLoading = !data.length;
    
    const listContainerStyle = {
      ...StyleSheet.absoluteFillObject,
      backgroundColor,
      position: 'absolute',
      top: this.scale.interpolate({
        inputRange: [0, 1],
        outputRange: [this.getPosition('top'), 0],
      }),
      left: this.scale.interpolate({
        inputRange: [0, 1],
        outputRange: [this.getPosition('left'), 0],
      }),
      opacity: this.scale,
      transform: [
        {
          scale: this.scale.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
          }),
        },
      ],
    };

    return (
      <View
        orientation={this.state.orientation}
        style={styles.container}
      >
        {showLoading && <Loading />}

        {showGalleryList && (
          <GalleryList
            {...rest}
            type={type}
            data={data}
            onPressImage={this.handleOnPressImage}
            onErrorImage={this.handleOnErrorImage}
            brokenImages={brokenImages}
            isImageBroken={this.isImageBroken}
          />
        )}

        <Animated.View style={listContainerStyle}>
          {showCloseButton && showGalleryList && (
            <View style={styles.closeButtonContainer}>
              <TouchableWithoutFeedback onPress={this.closeImage}>
                <Image
                  source={require('./src/assets/close.png')}
                  style={styles.closeImage}
                />
              </TouchableWithoutFeedback>
            </View>
          )}

          <FlatList
            data={data}
            initialNumToRender={initialNumToRender}
            ref={ref => this.swiper = ref}
            onMomentumScrollEnd={this.onScrollEnd}
            getItemLayout={this.getItemLayout}
            renderItem={this.renderItem}
            keyExtractor={item => item.id}
            pagingEnabled={true}
            horizontal={true}
          />
        </Animated.View>

        {showPagination && (
          <Pagination
            index={this.state.index}
            data={data}
            initialPaginationSize={initialPaginationSize}
            goTo={this.goTo}
            backgroundColor={backgroundColor}
            brokenImages={brokenImages}
            isImageBroken={this.isImageBroken}
            containerStyle={{
              transform: [
                {
                  translateY: this.pagination.interpolate({
                    inputRange: [0, 1],
                    outputRange: [200, 0],
                  }),
                },
              ],
            }}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButtonContainer: {
    width: '100%',
    alignItems: 'flex-end',
  },
  closeImage: {
    margin: 10,
    marginHorizontal: 20,
  },
});
