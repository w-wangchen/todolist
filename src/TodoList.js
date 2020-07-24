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
          <button onClick={ this.handleBtnClick.bind(this) }>提交</button>
        </div>
        <ul>
          {
            this.state.list.map((item, index) => {
              return (
                <li key={ index }
                    onClick={ this.handleItemDelete.bind(this, index) }>{ item }</li>
              )
            })
          }
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

  handleBtnClick() {
    this.setState({
      list: [...this.state.list, this.state.inputValue],
      inputValue: '',
    })
  }

  handleItemDelete(index) {
    console.log('下标: ', index)
    // state list 进行拷贝
    // state immutable 不可变 状态
    const list = [...this.state.list]
    list.splice(index, 1)
    this.setState({
      list: list,
    })
  }
}

export default TodoList
