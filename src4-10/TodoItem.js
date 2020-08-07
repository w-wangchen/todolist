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

  componentWillMount() {
    console.log('child componentWillMount')
  }

  componentDidMount(){
    console.log('child componentDidMount')
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    if (nextProps.content !== this.props.content)
      return true
    return false
  }

  render() {
    const { content } = this.props
    return (<div onClick={ this.handleClick }><span>{ content }</span></div>)
  }

  handleClick() {
    const { index, deleteItem } = this.props
    deleteItem(index)
  }

}

TodoItem.propTypes = {
  content: PropTypes.string,
  index: PropTypes.number,
  deleteItem: PropTypes.func,
}

TodoItem.defaultProps = {}

export default TodoItem
