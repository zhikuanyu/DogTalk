'use strict'

import queryString from 'query-string';
import _ from 'lodash';
import Mock from 'mockjs';
import config from './config';

let http = {};

http.get = (url, params) => {
  if (params) {
    url += '?' + queryString.stringify(params)
  }

  return fetch(url)
    .then((response) => response.json())
    .then((responseData) => Mock.mock(responseData))
}

http.post = (url, body) => {
  let options = _.extend(config.header, {
    body: JSON.stringify(body)
  })

  return fetch(url, options)
    .then((response) => response.json())
    .then((responseData) => Mock.mock(responseData))
}

export default http;