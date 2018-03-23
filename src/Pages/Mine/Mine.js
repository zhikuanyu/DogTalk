import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';

// 导入base64图标文件
import Icon from '../../Common/Icons'

// 获取屏幕的宽度
import Dimensions from 'Dimensions'
const { width } = Dimensions.get('window')

// 导入图片选择器模块
import ImagePicker from 'react-native-image-picker'

// 导入网络请求的组件
import http from '../../Common/http'
import config from '../../Common/config'

// sha1
import sha1 from 'sha1'

// 导入进度条组件
import * as Progress from 'react-native-progress'

function avatar(id, type) {
  return config.cloudinary.base + '/' + type + '/upload/' + id
}

class Mine extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: null,
      avatarProgress: 0,
      avatarUploading: false
    }

    this._pickPhoto = this._pickPhoto.bind(this)
    this._upload = this._upload.bind(this)
  }

  componentDidMount() {
    let that = this
    AsyncStorage.getItem('user')
      .then((data) => {
        let user
        if (data) {
          user = JSON.parse(data)
        }
        if (user && user.accessToken) {
          that.setState({
            user: user
          })
        }
      })
  }

  // 图片上传
  _upload(body) {
    let that = this
    let xhr = new XMLHttpRequest()
    let url = config.cloudinary.image

    xhr.open('POST', url)

    that.setState({
      avatarUploading: true,
      avatarProgress: 0
    })

    console.log(that.state.avatarUploading)

    // 监听图片上传的实时进度
    if (xhr.upload) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          let percent = Number((event.loaded / event.total).toFixed(2))
          console.log(percent)

          that.setState({
            avatarProgress: percent
          })
        }
      }
    }

    // 监听上传是否成功
    xhr.onload = () => {
      if(xhr.status !== 200) {
        alert(xhr.responseText)
        return
      }
      if(!xhr.responseText) {
        alert('请求失败')
        return
      }

      let response
      try {
        response = JSON.parse(xhr.response)
      }
      catch (e) {
        console.log(e)
        console.log('parse fails')
      }

      // 上传成功
      if(response && response.public_id) {
        let user = that.state.user
        user.avatar = avatar(response.public_id, 'image')

        that.setState({
          vatarProgress: 1,
          user: user,
          avatarUploading: false,
        })
      }
    }

    xhr.send(body)
  }

  // 从设备选择图片
  _pickPhoto() {
    let that = this
    let options = {
      title: '选择头像',
      cancelButtonTitle: '取消',
      takePhotoButtonTitle: '拍照',
      chooseFromLibraryButtonTitle: '选择相册',
      quality: 0.75,
      allowsEditing: true,
      noData: false,
      storageOptions: {
        skipBackup: true,
        path: 'images'
      }
    }

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        return
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let avatarUrl = 'data:image/jpeg;base64,' + response.data

        // 时间戳
        let timestamp = Date.now()
        let tags = 'avatar'
        let folder = 'avatar'
        // 获取签名请求的url
        let signatureURL = config.api.base + config.api.signature

        let accessToken = that.state.user.accessToken



        let signature = 'folder=' + folder + '&tags=' + tags + '&timestamp=' + timestamp + config.cloudinary.api_secret
        signature = sha1(signature)

        let body = new FormData()

        body.append('folder', folder)
        body.append('signature', signature)
        body.append('tags', tags)
        body.append('api_key', config.cloudinary.api_key)
        body.append('resource_type', 'image')
        body.append('file', avatarUrl)
        body.append('timestamp', timestamp)

        // 上传图片到图床
        this._upload(body)




        /*http.post(signatureURL, {
          accessToken: '',
          timestamp: timestamp,
          folser: folder,
          tags: tags,
          type: 'avatar'
        })
        .then((data) => {
          console.log(data)
          if (data && data.success) {
            let signature = 'folder=' + folder + '&tags' + tags + '&timestamp=' + timestamp + config.cloudinary.api_secret
            signature = sha1(signature)

            let body = new FormData()

            body.append('folder', folder)
            body.append('signature', signature)
            body.append('tags', tags)
            body.append('api_key', config.cloudinary.api_key)
            body.append('resource_type', 'image')
            body.append('file', avatarUrl)
            body.append('timestamp', timestamp)

            // 上传图片到图床
            this._upload(body)
          }
        })
        .catch((error) => {
          console.log(error)
        })*/
      }
    })
  }

  render() {
    let user = this.state.user || {}
    return (
      <View style={styles.container}>
        {/* 标题 */}
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>我的账户</Text>
        </View>
        {
          user.avatar
          ? <TouchableOpacity onPress={this._pickPhoto} style={styles.avatarContainer}>
              <ImageBackground source={{uri: user.avatar}} style={styles.avatarContainer}>
                {
                  this.state.avatarUploading
                  ? <Progress.Circle
                      size={width * 0.2}
                      showsText={true}
                      color={'#0f0'}
                      progress={this.state.avatarProgress} />
                  : <View>
                      <Image source={{uri: user.avatar}} style={styles.avatar}/>
                      <Text style={styles.avatarTip}>戳这里换头像</Text>
                    </View>
                }
              </ImageBackground>
            </TouchableOpacity>
          : <View style={styles.avatarContainer}>
              <Text style={styles.avatarTip}>添加狗狗头像</Text>
              {
                this.state.avatarUploading
                ? <Progress.Circle
                    size={width * 0.2}
                    showsText={true}
                    color={'#0f0'}
                    progress={this.state.avatarProgress} />
                : <TouchableOpacity onPress={this._pickPhoto} style={styles.avatarBox}>
                    <Image source={{uri: Icon.plus}} style={styles.plusIcon} />
                  </TouchableOpacity>
              }
            </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735c',
  },
  toolbarTitle: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  avatarContainer: {
    width: width,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee',
  },
  avatarBox: {
    padding: 15,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8
  },
  avatar: {
    marginBottom: 15,
    width: width * 0.2,
    height: width * 0.2,
    resizeMode: 'cover',
    borderRadius: width * 0.1,
    borderWidth: 2,
    borderColor: '#ee735c'
  },
  avatarTip: {
    color: '#ee735c',
    backgroundColor: 'transparent',
    fontSize: 14
  },
  plusIcon: {
    width: 40,
    height: 40,
    tintColor: '#ddd'
  }
})

export default Mine;