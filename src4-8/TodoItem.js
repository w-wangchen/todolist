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

  // 当组件从父组件接收参数
  // 只有父组件的render函数重新被执行，子组件的生命周期函数就会被执行
  componentWillReceiveProps(nextProps, nextContext) {
    console.log('child componentWillReceiveProps')
  }

  // 当组件即将被从页面剔除，才能被执行
  componentWillUnmount() {
    console.log('child componentWillUnmount')
  }

  render() {
    const { content } = this.props
    // JSX -> createElement -> 虚拟DOM(JS 对象) -> 真实DOM
    // return (<div><span>item</span></div>)
    // return React.createElement('div', {}, React.createElement('span', {}, 'item'))
    return (<div onClick={this.handleClick}><span>{content}</span></div>)
  }

  handleClick() {
    const { index, deleteItem } = this.props
    console.log('父组件传递index: ', index)
    deleteItem(index)
  }

}

TodoItem.propTypes = {
  content: PropTypes.string,
  index: PropTypes.number,
  deleteItem: PropTypes.func,
}

TodoItem.defaultProps = {
  text: 'text',
}

export default TodoItem
