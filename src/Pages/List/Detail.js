import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  Modal,
  StyleSheet,
  ListView,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';

// 导入视频播放组件
import Video from 'react-native-video';

// 导入base64图标
import Icons from '../../Common/Icons';

//  导入header组件
import BaseHeader from '../../Components/Header/header';

// 导入网络请求
import config from '../../Common/config';
import http from '../../Common/http';

// 获取屏幕的宽度
import Dimensions from 'Dimensions';
const { width } = Dimensions.get('window');

// 导入button组件
import Button from 'apsl-react-native-button';

// 评论列表的缓存数据
let cacheResults = {
  nextPage: 1,
  items: [],
  total: 0
}

class Detail extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})

    this.state = {
      data: this.props.navigation.state.params.data,
      isLoadingTail: false,

      // video player
      rate: 1,
      muted: false,
      resizeMode: 'contain',
      repeat: false,

      // video loaded
      videoLoaded: false,
      videoProgress: 0.01,
      videoTotal: 0,
      currentTime: 0,
      playing: false,
      paused: false,
      videoOK: true,

      // comments
      dataSource: ds.cloneWithRows([]),

      // modal
      modalVisible: false,
      animationType: 'none',
      isSending: false,
      content: ''
    }

    this._backToList = this._backToList.bind(this)
    this._rePlay = this._rePlay.bind(this)
    this._fetchData = this._fetchData.bind(this)
    this._fetchMoreData = this._fetchMoreData.bind(this)
    this._renderHeader = this._renderHeader.bind(this)
    this._renderFooter = this._renderFooter.bind(this)
    this._focus = this._focus.bind(this)
    this._blur = this._blur.bind(this)
    this._closeModal = this._closeModal.bind(this)
    this._setModalVisible = this._setModalVisible.bind(this)
    this._submit = this._submit.bind(this)
  }

  _backToList() {
    this.props.navigation.goBack()
  }

  _onLoadStart() {

  }

  _onLoad() {

  }

  _onProgress(data) {

    let duration = data.playableDuration
    let currentTime = data.currentTime
    let percent = Number((currentTime / duration).toFixed(2))

    let newState = {
      videoTotal: duration,
      currentTime: Number(currentTime.toFixed(2)),
      videoProgress: percent
    }

    if (!this.state.videoLoaded) {
      newState.videoLoaded = true
    }

    if (!this.state.playing && this.state.videoProgress < 1) {
      newState.playing = true
    }

    this.setState(newState)
  }

  _onEnd() {
    this.setState({
      videoProgress: 1,
      playing: false
    })
  }

  _onError(error) {
    this.setState({
      videoOK: false
    })
  }

  _rePlay() {
    this.refs.videoPlayer.seek(0)
  }

  _pause() {
    if (!this.state.paused) {
      this.setState({
        paused: true
      })
    }
  }

  _resume() {
    if (this.state.paused) {
      this.setState({
        paused: false
      })
    }
  }

  // 获取评论列表的数据
  _fetchData(page) {
    let that = this
    let url = config.api.base + config.api.comment

    that.setState({
      isLoadingTail: true
    })

    http.get(url, {
      accessToken: 'abcdef',
      creation: '123',
      page: page
    })
    .then((data) => {
      if (data && data.success) {
        let items = cacheResults.items.slice()
        items = items.concat(data.data)
        cacheResults.items = items
        cacheResults.total = data.total
        cacheResults.nextPage += 1

        that.setState({
          isLoadingTail: false,
          dataSource: that.state.dataSource.cloneWithRows(cacheResults.items)
        })
      }
    })
    .catch((error) => {
      that.setState({
        isLoadingTail: false
      })
      console.warn(error)
    })
  }

  // 评论列表加载更多
  _fetchMoreData() {
    if (!this._hasMore() || this.state.isLoadingTail) {
      return
    }

    let page = cacheResults.nextPage
    this._fetchData(page)
  }

  // 是否还有更多数据
  _hasMore() {
    return cacheResults.items.length !== cacheResults.total
  }

  _focus() {
    this._setModalVisible(true)
  }

  _blur() {

  }

  _closeModal() {
    this._setModalVisible(false)
  }

  _setModalVisible(isVisible) {
    this.setState({
      modalVisible: isVisible
    })
  }

  _submit() {
    let that = this
    if (!that.state.content) {
      alert('留言不能为空！')
      return 
    }
    if (that.state.isSending) {
      alert('正在评论中！')
      return 
    }

    that.setState({
      isSending: true
    }, () => {
      let body = {
        accessToken: 'abc',
        creation: '123',
        content: that.state.content
      }
      let url = config.api.base + config.api.comment

      http.post(url, body)
      .then((data) => {
        if (data && data.success) {
          let items = cacheResults.items.slice()
          let content = this.state.content
          items = [{
            content: content,
            replyBy: {
              nickname: '狗狗说',
              avatar: 'https://dummyimage.com/640x640/18902c)'
            }
          }].concat(items)

          cacheResults.items = items
          cacheResults.total += 1
          that.setState({
            content: '',
            isSending: false,
            dataSource: this.state.dataSource.cloneWithRows(cacheResults.items)
          })
          that._setModalVisible(false)
        }
      })
      .catch((error) => {
        console.log(error);
        that.setState({
          isSending: false
        })
        that._setModalVisible(false)
        alert('留言失败，稍后重试！')
      })
    })
  }

  componentDidMount() {
    this._fetchData()
  }

  // 评论列表头部
  _renderHeader() {
    let data = this.state.data;
    return (
      <View style={styles.listHeader}>
        {/* 视频作者信息 */}
        <View style={styles.infoBox}>
          <Image source={{uri: data.author.avatar}} style={styles.avatar} />
          <View style={styles.descBox}>
            <Text style={styles.nickname}>{data.author.nickname}</Text>
            <Text style={styles.title}>{data.title}</Text>
          </View>
        </View>
        {/* 输入评论 */}
        <View style={styles.commentBox}>
          <View style={styles.comment}>
            <TextInput
              placeholder="敢不敢评论一个..."
              underlineColorAndroid='transparent'
              style={styles.content}
              numberOfLines={3}
              multiline={true}
              onFocus={this._focus}
            />
          </View>
        </View>
        {/* 精彩评论 */}
        <View style={styles.commentArea}>
          <Text style={styles.commentTitle}>精彩评论</Text>
        </View>
      </View>
    )
  }

  // 评论列表的每一项
  _renderRow(row) {
    return (
      <View key={row._id} style={styles.replyBox}>
        <Image source={{uri: row.replyBy.avatar}} style={styles.replyAvatar} />
        <View style={styles.reply}>
          <Text style={styles.replyNickname}>{row.replyBy.nickname}</Text>
          <Text style={styles.replyContent}>{row.content}</Text>
        </View>
      </View>
    )
  }

  // 评论列表 加载更改或菊花转
  _renderFooter() {
    if (!this._hasMore() && cacheResults.total != 0) {
      return (
        <View style={styles.loadingMore}>
          <Text style={styles.loadingText}>没有更多了</Text>
        </View>
      )
    }

    if (!this.state.isLoadingTail) {
      return <View style={styles.loadingMore} />
    }

    return <ActivityIndicator style={styles.loadingMore} />
  }

  render() {
    let data = this.state.data
    return (
      <View style={styles.container}>
        {/* 标题栏 */}
        <BaseHeader leftTitle="返回" mainTitle="详情页面" backHandle={this._backToList} />
        {/* 播放视频区域 */}
        <View style={styles.videoBox}>
          <Video
            ref="videoPlayer"
            source={{uri: data.video}}
            style={styles.video}
            volume={3}
            paused={this.state.paused}
            rate={this.state.rate}
            muted={this.state.muted}
            resizeMode={this.state.resizeMode}
            repeat={this.state.repeat}

            onLoadStart={this._onLoadStart.bind(this)}
            onLoad={this._onLoad.bind(this)}
            onProgress={this._onProgress.bind(this)}
            onEnd={this._onEnd.bind(this)}
            onError={this._onError.bind(this)}
          />
          {/* 视频加载出错的提示语 */}
          {
            !this.state.videoOK && <Text style={styles.failText}>视频出错了！很抱歉</Text>
          }
          {/* 加载指示器 -- 菊花转 */}
          {
            !this.state.videoLoaded && 
              <ActivityIndicator color="#ee735c" style={styles.loading} />
          }
          {/* 播放按钮 */}
          {
            this.state.videoLoaded && !this.state.playing ? (
              <TouchableOpacity onPress={this._rePlay} style={styles.playBox}>
                <Image
                  source={{uri: Icons.play}}
                  style={styles.play} />
              </TouchableOpacity>
            ) : null
          }
          {/* 暂停/播放按钮 */}
          {
            this.state.videoLoaded && this.state.playing ? (
              <TouchableOpacity onPress={this._pause.bind(this)} style={styles.pauseBtn}>
                {
                  this.state.paused ? (
                    <TouchableOpacity onPress={this._resume.bind(this)} style={styles.playBox}>
                      <Image
                        source={{uri: Icons.play}}
                        style={styles.play} />
                    </TouchableOpacity>
                  ) : <Text></Text>
                }
              </TouchableOpacity>
            ) : null
          }
          {/* 进度条 */}
          <View style={styles.progressBox}>
            <View style={[styles.progressBar, {width: width * this.state.videoProgress}]}></View>
          </View>
        </View>
        {/* 评论列表 */}
        <ListView
          dataSource={this.state.dataSource}
          renderHeader={this._renderHeader}
          renderRow={this._renderRow}
          renderFooter={this._renderFooter}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={20}
          automaticallyAdjustContentInsets={false}
          enableEmptySections={true}
          showsVerticalScrollIndicator={false}
        />
        {/* 评论的modal */}
        <Modal
          animationType={"fade"}
          visible={this.state.modalVisible}
          onRequestClose={() => this._setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={this._closeModal}>
              <Image
                source={{uri: Icons.close}}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
            <View style={styles.commentBox}>
              <View style={styles.comment}>
                <TextInput
                  placeholder="敢不敢评论一个..."
                  underlineColorAndroid='transparent'
                  style={styles.content}
                  numberOfLines={3}
                  multiline={true}
                  defaultValue={this.state.content}
                  onChangeText={(text) => {
                    this.setState({
                      content: text
                    })
                  }}
                />
              </View>
              <Button
                style={styles.submitBtn}
                textStyle={styles.btnStyle}
                onPress={this._submit}>
                评论
              </Button>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  modalContainer: {
    flex: 1,
    paddingTop: 45,
    backgroundColor: '#fff'
  },
  closeIcon: {
    alignItems: 'center',
    width: 30,
    height: 30,
    tintColor: '#ee753c'
  },
  videoBox: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000',
  },
  video: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000',
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: 90,
    width: width,
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  progressBox: {
    width: width,
    height: 3,
    backgroundColor: '#ccc',
  },
  progressBar: {
    width: 1,
    height: 3,
    backgroundColor: "#ff6600"
  },
  playBox: {
    position: 'absolute',
    top: 80,
    left: width / 2 - 23
  },
  play: {
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
  pauseBtn: {
    width: width,
    height: width * 0.56,
    position: 'absolute',
    left: 0,
    top: 0
  },
  failText: {
    position: 'absolute',
    left: 0,
    top: width * 0.28,
    width: width,
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: '#fff'
  },
  infoBox: {
    width: width,
    flexDirection: 'row',
    marginTop: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 30,
  },
  descBox: {
    flex: 1
  },
  nickname: {
    fontSize: 18,
  },
  title: {
    marginTop: 8,
    fontSize: 16,
    color: '#666'
  },
  reply: {
    flex: 1
  },
  replyBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10
  },
  replyAvatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 20
  },
  replyNickname: {
    color: '#666'
  },
  replyContent: {
    marginTop: 4,
    color: '#666'
  },
  loadingMore: {
    marginVertical: 20,
  },
  loadingText: {
    color: '#777',
    textAlign: 'center'
  },
  listHeader: {
    width: width,
    marginTop: 10
  },
  commentBox: {
    marginTop: 10,
    marginBottom: 10,
    padding: 8,
    width: width
  },
  content: {
    paddingLeft: 2,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    fontSize: 14,
    height: 80,
    padding: 0
  },
  commentArea: {
    width: width,
    marginTop: 10,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  submitBtn: {
    width: width - 20,
    padding: 6,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ee753c',
    borderRadius: 4
  },
  btnStyle: {
    fontSize: 16
  }
})

export default Detail