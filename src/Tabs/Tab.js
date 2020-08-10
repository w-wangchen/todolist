/**
 * @作者 wangchn86@163.com
 * @创建时间 2020/8/10 6:14 下午
 */
import React, { Component, Fragment } from 'react'

class Widget extends Component {

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  render() {
    const { label, onClick, activeTab, index } = this.props

    let className = ''
    if (activeTab === index)
      className += 'active'
    return (
      <p className={ className }
         onClick={ this.handleClick }>{ label }</p>
    )
  }

  handleClick() {
    const { onClick, index } = this.props
    onClick(index)
  }
}

export default Widget
