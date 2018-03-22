import React, { Component } from 'react'
import {
  AsyncStorage
} from 'react-native'

import { AppRegistry } from 'react-native'
import App from './App'
import Login from './src/Pages/Login/Login'

class Main extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: null,
      logined: false
    }

    this._afterLogin = this._afterLogin.bind(this)
    this._asyncAppStatus = this._asyncAppStatus.bind(this)
  }

  componentDidMount() {
    this._asyncAppStatus()
  }


  // 获取用户是否登陆
  _asyncAppStatus() {
    let that = this
    AsyncStorage.getItem('user')
      .then((data) => {
        let user

        if (data) {
          user = JSON.parse(data)
        }

        if (user && user.accessToken) {
          that.setState({
            user: user,
            logined: true
          })
        }
      })
  }

  // 登陆成功后将用户信息存在本地
  _afterLogin(user) {
    let that = this
    user = JSON.stringify(user)
    AsyncStorage.setItem('user', user)
      .then(() => {
        that.setState({
          logined: true,
          user: user
        })
      })
  }

  render() {
    if (this.state.logined) {
      return <App />
    } else {
      return <Login afterLogin={this._afterLogin} />
    }
  }
}

AppRegistry.registerComponent('DogTalk', () => Main);
