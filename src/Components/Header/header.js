import React, { Component } from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  Platform
} from 'react-native';

import PropTypes from 'prop-types';

// 导入base64图标
import Icons from '../../Common/Icons';

// 获取屏幕的宽度
import Dimensions from 'Dimensions';
const { width } = Dimensions.get('window');

class BaseHeader extends Component {
  static defaultProps = {
    leftTitle: '',
    mainTitle: '',
    backHandle: null
  }

  static propTypes = {
    leftTitle: PropTypes.string,
    mainTitle: PropTypes.string.isRequired,
    backHandle: PropTypes.func
  }

  render() {
    return (
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBox} onPress={this.props.backHandle}>
          <Image source={{uri: Icons.go_back}} style={styles.backIcon} />
          <Text style={styles.backText}>{this.props.leftTitle}</Text>
        </TouchableOpacity>
        <Text style={styles.mainTitle} numberOfLines={1}>{this.props.mainTitle}</Text>
      </View> 
    )
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width,
    height: 64,
    paddingTop: Platform.OS === 'ios' ? 22 : 0,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  backBox: {
    position: 'absolute',
    left: 12,
    top: Platform.OS === 'ios' ? 32 : 22,
    flexDirection: 'row',
    alignItems: 'center'
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#999',
    marginRight: 5,
  },
  backText: {
    color: '#999'
  },
  mainTitle: {
    width: width - 120,
    textAlign: 'center',
    fontSize: 18,
  }
})

export default BaseHeader