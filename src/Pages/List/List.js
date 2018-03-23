import React, { Component } from 'react';
import {
  Platform,
  View,
  Text,
  Image,
  StyleSheet,
  ListView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';

// 导入网络请求
import config from '../../Common/config';
import http from '../../Common/http';

// 导入子组件item
import Item from './item';

// 视频列表的缓存数据
let cacheResults = {
  nextPage: 1,
  items: [],
  total: 0
}

class List extends Component {
  constructor() {
    super();

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2})
    this.state = {
      dataSource: ds.cloneWithRows([]),
      isLoadingTail: false,
      nextPage: 1,
      isRefreshing: false
    }

    this._renderRow = this._renderRow.bind(this)
    this._fetchData = this._fetchData.bind(this)
    this._fetchMoreData = this._fetchMoreData.bind(this)
    this._hasMore = this._hasMore.bind(this)
    this._renderFooter = this._renderFooter.bind(this)
    this._onRefresh = this._onRefresh.bind(this)
    this._loadPage = this._loadPage.bind(this)
  }

  _renderRow(row) {
    return <Item
      key={row._id}
      onSelect={() => this._loadPage(row)}
      row={row} />
  }

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

  _fetchData(page) {

    if (page !== 0) {
      this.setState({
        isLoadingTail: true
      })
    } else {
      this.setState({
        isRefreshing: true
      })
    }

    http.get(config.api.base + config.api.creations, {
      accessToken: 'abcdef',
      page: page
    })
    .then((data) => {
      if (data.success) {
        let items = cacheResults.items.slice()

        if (page !== 0) {
          items = items.concat(data.data)
          cacheResults.nextPage += 1
        } else {
          items = data.data.concat(items)
        }
        
        cacheResults.items = items
        cacheResults.total = data.total

        if (page !== 0) {
          this.setState({
            isLoadingTail: false,
            dataSource: this.state.dataSource.cloneWithRows(cacheResults.items)
          })
        } else {
          this.setState({
            isRefreshing: false,
            dataSource: this.state.dataSource.cloneWithRows(cacheResults.items)
          })
        }
        
      }
    })
    .catch((error) => {
      if (page !== 0) {
        this.setState({
          isLoadingTail: false
        })
      } else {
        this.setState({
          isRefreshing: false
        })
      }
    })
  }

  _hasMore() {
    return cacheResults.items.length !== cacheResults.total
  }

  _fetchMoreData() {
    if (!this._hasMore() || this.state.isLoadingTail) {
      return
    }

    let page = cacheResults.nextPage
    this._fetchData(page)
  }

  _onRefresh() {
    
    if (!this._hasMore() || this.state.isRefreshing) {
      return
    }

    this._fetchData(0)
  }

  _loadPage(row) {
    this.props.navigation.navigate('Detail', {
      data: row
    })
  }

  componentDidMount() {
    this._fetchData(1);
  }

  render() {
    return (
      <View style={styles.container}>
        {/*页面标题 -- 狗狗说*/}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>狗狗说</Text>
        </View>
        {/*视频列表*/}
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          automaticallyAdjustContentInsets={false}
          enableEmptySections={true}
          onEndReached={this._fetchMoreData}
          onEndReachedThreshold={20}
          renderFooter={this._renderFooter}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              tintColor="#ff6600"
              title="拼命加载中..."
              titleColor="#00ff00"
              colors={['#ff0000', '#00ff00', '#0000ff']}
              progressBackgroundColor="#ffff00"
            />
          }
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 25 : 12,
    paddingBottom: 12,
    backgroundColor: '#ee735c'
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  loadingMore: {
    marginVertical: 20,
  },
  loadingText: {
    color: '#777',
    textAlign: 'center'
  }
})

export default List;