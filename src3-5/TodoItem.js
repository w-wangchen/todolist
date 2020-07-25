/**
 * @作者 wangchn86@163.com
 * @创建时间 2020/7/25 8:37 上午
 */
import React, { Component } from 'react'

class TodoItem extends Component {

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  render() {

    return (
      <li
        onClick={ this.handleClick }
      >
        { this.props.content }
      </li>
    )
  }

  handleClick() {
    console.log('父组件传递index: ', this.props.index)
    this.props.deleteItem(this.props.index)
  }

}

export default TodoItem
