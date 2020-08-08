/**
 * @作者 wangchn86@163.com
 * @创建时间 2020/8/7 11:48 下午
 */
import React, { Component, Fragment } from 'react'
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group'
import './style.css'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      list: [],
    }
    this.handleAddItem = this.handleAddItem.bind(this)
  }

  render() {
    const { list } = this.state
    return (
      <Fragment>
        <TransitionGroup>
          {
            list.map((item, index) => {

              return (
                <CSSTransition timeout={ 1000 }
                               classNames={ 'fade' }
                  // unmountOnExit
                               onEntered={ (el) => (el.style.color = 'red') }
                               appear={ true }
                >
                  <div>{ item }</div>
                </CSSTransition>
              )
            })
          }
        </TransitionGroup>

        <button onClick={ this.handleAddItem }>toggle</button>
      </Fragment>
    )
  }

  handleAddItem() {
    this.setState((prevState) => ({
      list: [...prevState.list, 'item'],
    }))
  }
}

export default App
