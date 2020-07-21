/**
 * @作者 wangchn86@163.com
 * @创建时间 2020/7/22 12:49 上午
 */
import React, {Component, Fragment} from 'react'

class TodoList extends Component{

  render() {

    return (
      <Fragment>
        <div>
          <input/>
          <button>提交</button>
        </div>
        <ul>
          <li>学英语</li>
          <li>learnning React</li>
        </ul>
      </Fragment>
    )
  }
}

export default TodoList
