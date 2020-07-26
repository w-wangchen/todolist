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
    const { content } = this.props
    return (
      <li
        onClick={ this.handleClick }
      >
        { content }
      </li>
    )
  }

  handleClick() {
    const { index, deleteItem } = this.props
    console.log('父组件传递index: ', index)
    deleteItem(index)
  }

}

export default TodoItem
