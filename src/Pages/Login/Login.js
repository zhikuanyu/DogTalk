import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet
} from 'react-native';

// 引入外部button组件
import Button from 'apsl-react-native-button'

// 引入网络请求组件
import http from '../../Common/http'
import config from '../../Common/config'

// 引入倒计时组件
import CountDownText from 'react-native-sk-countdown'

// 获取屏幕的宽度
import Dimensions from 'Dimensions';
const { width } = Dimensions.get('window');

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      codeSent: false,
      countingDone: false,
      phoneNumber: '',
      verifyCode: ''
    }

    this._sendVerifyCode = this._sendVerifyCode.bind(this)
    this._countingDone = this._countingDone.bind(this)
    this._showVerifyCode = this._showVerifyCode.bind(this)
    this._submit = this._submit.bind(this)
  }

  // 登陆
  _submit() {
    let that = this
    let phoneNumber = this.state.phoneNumber
    let verifyCode = this.state.verifyCode

    if (!phoneNumber || !verifyCode) {
      alert('手机号或验证码不能为空！')
      return
    }

    let verifyURL = config.api.base + config.api.verify
    let body = {
      phoneNumber: phoneNumber,
      verifyCode: verifyCode
    }
    
    http.post(verifyURL, body)
      .then((data) => {
        if (data && data.success) {
          that.props.afterLogin(data.data)
        } else {
          alert('登录失败，请检查手机号或验证码是否正确！')
        }
      })
      .catch((error) => {
        alert('登录失败，请检查手网络是否良好！')
      })
  }

  // 倒计时完成后的回调
  _countingDone() {
    this.setState({
      countingDone: true
    })
  }

  // 显示出获取验证码按钮
  _showVerifyCode() {
    this.setState({
      codeSent: true,
      countingDone: false
    })
  }

  // 发送验证码
  _sendVerifyCode() {
    let that = this
    let phoneNumber = this.state.phoneNumber

    if (!phoneNumber) {
      alert('手机号不能为空！')
      return
    }

    let signURL = config.api.base + config.api.signup
    let body = {
      phoneNumber: phoneNumber
    }
    
    http.post(signURL, body)
      .then((data) => {
        if (data && data.success) {
          that._showVerifyCode()
        } else {
          alert('获取验证码失败，请检查手机号是否正确！')
        }
      })
      .catch((error) => {
        alert('获取验证码失败，请检查手网络是否良好！')
      })
  }
  
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.signupBox}>
          <Text style={styles.title}>快速登陆</Text>
          <TextInput
            placeholder="输入手机号"
            autoCapitalize={'none'}
            autoCorrect={false}
            keyboardType={'number-pad'}
            style={styles.inputField}
            onChangeText={(text) => {
              this.setState({
                phoneNumber: text
              })
            }}
          />

          {
            this.state.codeSent
            ? <View style={styles.verifyCodeBox}>
                <TextInput
                  placeholder="输入验证码"
                  autoCapitalize={'none'}
                  autoCorrect={false}
                  keyboardType={'number-pad'}
                  style={styles.inputField}
                  onChangeText={(text) => {
                    this.setState({
                      verifyCode: text
                    })
                  }}
                />
                {
                  this.state.countingDone
                  ? <Button
                      style={styles.countBtn}
                      textStyle={{color: '#fff',fontSize: 15,fontWeight: '600',}}
                      onPress={this._sendVerifyCode}>
                      获取验证码
                    </Button>
                  : <CountDownText
                      style={[styles.countBtn, {color: '#fff'}]}
                      countType='seconds'
                      auto={true}
                      afterEnd={this._countingDone}
                      timeLeft={3}
                      step={-1}
                      startText='获取验证码'
                      endText='获取验证码'
                      intervalText={(sec) => sec + '秒重新获取'}
                    />
                }
              </View>
            : null
          }

          {
            this.state.codeSent
            ? <Button
                style={styles.btn}
                textStyle={{color: '#ee735c'}}
                onPress={this._submit}>
                登录
              </Button>
            : <Button
                style={styles.btn}
                textStyle={{color: '#ee735c'}}
                onPress={this._sendVerifyCode}>
                获取验证码
              </Button>
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  signupBox: {
    marginTop: 30,
  },
  title: {
    marginBottom: 20,
    color: '#333',
    fontSize: 20,
    textAlign: 'center'
  },
  inputField: {
    width: width - 20,
    height: 40,
    padding: 5,
    color: '#666',
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  btn: {
    padding: 5,
    marginTop: 10,
    backgroundColor: 'transparent',
    borderColor: '#ee735c',
    borderWidth: 1,
    borderRadius: 4
  },
  verifyCodeBox: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  countBtn: {
    position: 'absolute',
    right: 0,
    width: 110,
    height: 40,
    padding: 10,
    marginLeft: 8,
    backgroundColor: '#ee735c',
    borderColor: '#ee735c',
    borderRadius: 2
  }
})

export default Login