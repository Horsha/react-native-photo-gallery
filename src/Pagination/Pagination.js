import React, { Component } from 'react';
import { Dimensions, Platform, Animated, StyleSheet } from 'react-native';

import SwiperThumb from './SwiperThumb';
import BetterList from '../BetterList';

export class Pagination extends Component {
  componentWillMount() {
    this.setContentInset()
  }

  componentDidUpdate() {
    this.list.pagination.scrollTo({ x: ((this.props.index * 64) - this.contentInset) });
    this.setContentInset();
  }

  setContentInset() {
    this.contentInset = (Dimensions.get('window').width / 2) - 32;
    this.insetOffSetParams = Platform.select({
      ios: {
        contentInset: { left: this.contentInset, right: this.contentInset },
        contentOffset: { x: -this.contentInset },
        contentContainerStyle: styles.subContainer,
      },
      android: {},
    });
  }

  navigate = (index) => () =>
    this.props.goTo({ index });

  renderRow = (item, i, index) => (
    <SwiperThumb
      {...item}
      key={index}
      data={this.props.data}
      active={index === this.props.index}
      navigate={this.navigate(index)}
      index={index}
      isImageBroken={this.props.isImageBroken(item.id)}
    />
  );

  render() {
    const {
      containerStyle,
    } = this.props;

    return (
      <Animated.View style={[styles.container, containerStyle]}>
        <BetterList
          ref={ref => this.list = ref}
          data={this.props.data}
          horizontal={true}
          renderRow={this.renderRow}
          style={[
            {
              backgroundColor: this.props.backgroundColor,
            },
          ]}
          overScrollMode="never"
          alwaysBounceHorizontal={false}
          removeClippedSubviews={false}
          {...this.insetOffSetParams}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    height: 64,
    flex: 1,
  },
  subContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }
});
