import React, { Component } from 'react';
import {
  Image,
  StyleSheet
} from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';

// 导入外部组件 -- 页面
import List from './src/Pages/List/List';
import Detail from './src/Pages/List/Detail';
import Shoot from './src/Pages/Shoot/Shoot';
import Mine from './src/Pages/Mine/Mine';

// 导入tabbar图标 -- base64
import Icons from './src/Common/Icons';

const ListStack = StackNavigator({
  List: { screen: List },
  Detail: {screen: Detail}
},{
  headerMode: 'none'
});

const ShootStack = StackNavigator({
  Shoot: { screen: Shoot }
},{
  headerMode: 'none'
});

const MineStack = StackNavigator({
  Mine: { screen: Mine }
},{
  headerMode: 'none'
});

const TabNav = TabNavigator(
  {
    List: {
      screen: ListStack,
      navigationOptions: {
        tabBarLabel: '列表',
        tabBarIcon: ({focused, tintColor}) => {
          return <Image source={{uri: Icons.list}} style={[{tintColor: tintColor}, styles.iconImage]} />
        }
      }
    },
    Shoot: {
      screen: ShootStack,
      navigationOptions: {
        tabBarLabel: '拍摄',
        tabBarIcon: ({focused, tintColor}) => {
          return <Image source={{uri: Icons.camera}} style={[{tintColor: tintColor}, styles.iconImage]} />
        }
      }
    },
    Mine: {
      screen: MineStack,
      navigationOptions: {
        tabBarLabel: '我的',
        tabBarIcon: ({focused, tintColor}) => {
          return <Image source={{uri: Icons.mine}} style={[{tintColor: tintColor}, styles.iconImage]} />
        }
      }
    }
  },
  {
    initialRouteName: 'List',
    tabBarPosition: 'bottom',
    swipeEnabled: true,
    animationEnabled: true,
    backBehavior: 'none',
    tabBarOptions: {
      // Android属性
      upperCaseLabel: false,
      showIcon: true,
      iconStyle: {
        marginBottom: 5,
      },
      indicatorStyle: {
        height: 0,
      },
      // 共有属性
      showLabel: true,
      activeTintColor: '#ee735c',
      inactiveTintColor: 'gray',
      style: {
          backgroundColor: 'white',
          height: 55,
      },
      labelStyle: {
          fontSize: 13,
          marginTop: -5,
          marginBottom: 5,
      }
    }
  }
);

const styles = StyleSheet.create({
  iconImage: {
    width: 24,
    height: 24
  }
})

export default TabNav;