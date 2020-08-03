/**
 * @作者 wangchn86@163.com
 * @创建时间 2020/7/25 8:37 上午
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'

class TodoItem extends Component {

  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  render() {
    const { content, text } = this.props
    return (
      <li
        onClick={ this.handleClick }
      >
        { text } - { content }
      </li>
    )
  }

  handleClick() {
    const { index, deleteItem } = this.props
    console.log('父组件传递index: ', index)
    deleteItem(index)
  }

}

TodoItem.propTypes = {
  text: PropTypes.string.isRequired,
  content: PropTypes.string,
  index: PropTypes.number,
  deleteItem: PropTypes.func,
}

TodoItem.defaultProps = {
  text: 'text',
}

export default TodoItem
