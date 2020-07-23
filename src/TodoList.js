/**
 * @作者 wangchn86@163.com
 * @创建时间 2020/7/22 12:49 上午
 */
import React, { Component, Fragment } from 'react'

class TodoList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      inputValue: 'hello world',
      list: [],
    }
  }

  render() {

    return (
      <Fragment>
        <div>
          <input value={ this.state.inputValue }
                 onChange={ this.handleInputChange.bind(this) }/>
          <button>提交</button>
        </div>
        <ul>
          <li>学英语</li>
          <li>learnning React</li>
        </ul>
      </Fragment>
    )
  }

  handleInputChange(e) {
    // console.log(e.target)// input dom
    // console.log(this)
    this.setState({
      inputValue: e.target.value,
    })
  }
}

export default TodoList
