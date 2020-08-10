/**
 * @作者 wangchn86@163.com
 * @创建时间 2020/8/11 12:15 上午
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Widget extends Component {

  render() {
    const { content } = this.props
    return (<div>{ content }</div>)
  }
}

Widget.propTypes = {
  content: PropTypes.string,
}

Widget.defaultProps = {
  content: '123',
}
export default Widget
