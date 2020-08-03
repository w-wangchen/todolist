/**
 * @作者 wangchn86@163.com
 * @创建时间 2020/7/22 12:49 上午
 */
import React, { Component, Fragment } from 'react'
import './style.css'
import TodoItem from './TodoItem'

class TodoList extends Component {

  constructor(props) {
    super(props)
    this.state = {
      inputValue: 'hello world',
      list: [],
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleBtnClick = this.handleBtnClick.bind(this)
    this.handleItemDelete = this.handleItemDelete.bind(this)
  }

  render() {

    return (
      <Fragment>
        <div>
          <label htmlFor={ 'insertArea' }>输入内容：</label>
          <input id={ 'insertArea' }
                 value={ this.state.inputValue }
                 onChange={ this.handleInputChange }
                 className={ 'input' }
          />
          <button onClick={ this.handleBtnClick }>提交</button>
        </div>
        <ul>
          { this.getTodoItem() }
        </ul>
      </Fragment>
    )
  }

  getTodoItem() {
    return this.state.list.map((item, index) => {
      return (
        <TodoItem key={ index }
                  index={ index }
                  content={ item }
                  deleteItem={ this.handleItemDelete }
        />
      )
    })
  }


  handleInputChange(e) {
    const value = e.target.value
    this.setState(() => {
      return {
        inputValue: value,
      }
    })
  }

  handleBtnClick() {
    this.setState((prevState) => {
      return {
        list: [...prevState.list, prevState.inputValue],
        inputValue: '',
      }
    })
  }

  handleItemDelete(index) {
    this.setState((prevState) => {
      const list = [...prevState.list]
      list.splice(index, 1)
      return {
        list,
      }
    })
  }
}

export default TodoList
