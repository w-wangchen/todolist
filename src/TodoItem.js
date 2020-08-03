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
    // JSX -> createElement -> 虚拟DOM(JS 对象) -> 真实DOM
    // return (<div><span>item</span></div>)
    return React.createElement('div', {}, React.createElement('span', {}, 'item'))
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
