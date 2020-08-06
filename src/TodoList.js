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
      inputValue: '',
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
                 ref={ (input) => this.input = input }
          />
          <button onClick={ this.handleBtnClick }>提交</button>
        </div>
        <ul ref={(ul)=>this.ul = ul}>
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
    // const value = e.target.value

    // console.log(e.target)// DOM元素 INPUT
    // console.log('this.input: ', this.input)// DOM元素INPUT
    const value = this.input.value
    this.setState(() => ({
      inputValue: value,
    }))
  }

  handleBtnClick() {
    this.setState((prevState) => {
      return {
        list: [...prevState.list, prevState.inputValue],
        inputValue: '',
      }
    },()=>{
      console.log('div,length: ',this.ul.querySelectorAll('div').length)
    })
    // setState 异步函数 下面代码优先执行
    // console.log(this.ul.querySelectorAll('div'))
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
