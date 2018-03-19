import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import _ from 'lodash';
import PropTypes from 'prop-types';

// 导入base64图标
import Icons from '../../Common/Icons';

// 获取屏幕的宽度
import Dimensions from 'Dimensions';
const { width } = Dimensions.get('window');

// 导入网络请求组件
import config from '../../Common/config';
import http from '../../Common/http';

class Item extends Component {
  static defaultProps = {
    row: null,
    onSelect: null
  }

  static propTypes = {
    row: PropTypes.object,
    onSelect: PropTypes.func
  }

  constructor(props) {
    super(props);
    this.state = {
      row: _.extend(props.row, {}),
      up: props.row.up
    }

    this._up = this._up.bind(this)
  }

  _up() {
    let that = this
    let row = this.state.row
    let up = !this.state.up
    let url = config.api.base + config.api.up

    let body = {
      id: row._id,
      up: up ? 'yes' : 'no',
      accessToken: 'abcdee'
    }

    http.post(url, body)
      .then((data) => {
        if (data && data.success) {
          that.setState({
            up: up
          })
        } else {
          alert('点赞失败，请稍后再试！')
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  render() {
    let row = this.state.row
    return (
      <TouchableOpacity onPress={this.props.onSelect}>
        <View style={styles.item}>
          {/*视频标题*/}
          <Text style={styles.title}>{row.title}</Text>
          {/*视频预览*/}
          <View>
            <Image source={{uri: row.thumb}} style={styles.thumb} />
            <Image source={{uri: Icons.play}} style={styles.play} />
          </View>
          {/*视频底部栏*/}
          <View style={styles.itemFooter}>
            {/*收藏*/}
            <TouchableOpacity onPress={this._up}>
              <View style={styles.handleBox}>
                <Image
                  source={{uri: this.state.up ? Icons.heart : Icons.heart_empty}}
                  style={[styles.minIcon, this.state.up ? styles.up : null]} />
                <Text style={styles.handleText}>喜欢</Text>
              </View>
            </TouchableOpacity>
            {/*评论*/}
            <View style={styles.handleBox}>
              <Image source={{uri: Icons.comment}} style={styles.minIcon} />
              <Text style={styles.handleText}>评论</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    width: width,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  title: {
    padding: 10,
    fontSize: 18,
    color: '#333'
  },
  preview: {

  },
  thumb: {
    width: width,
    height: width * 0.56,
    resizeMode: 'cover'
  },
  play: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 46,
    height: 46,
    paddingTop: 9,
    paddingLeft: 18,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 23,
    tintColor: '#ed7b66'
  },
  itemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#eee'
  },
  handleBox: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    width: width / 2 - 0.5,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  minIcon: {
    width: 22,
    height: 22,
    tintColor: '#333'
  },
  up: {
    tintColor: '#f00'
  },
  handleText: {
    left: 12,
    fontSize: 18,
    color: '#333'
  }
})

export default Item