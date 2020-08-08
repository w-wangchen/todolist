/**
 * @作者 wangchn86@163.com
 * @创建时间 2020/8/7 11:48 下午
 */
import React, { Component, Fragment } from 'react'
import { CSSTransition } from 'react-transition-group'
import './style.css'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      show: true,
    }
    this.handleToggole = this.handleToggole.bind(this)
  }

  render() {
    const { show } = this.state
    return (
      <Fragment>
        <CSSTransition in={ show }
                       timeout={ 1000 }
                       classNames={ 'fade' }
          // unmountOnExit
                       onEntered={ (el) => (el.style.color = 'red') }
                       appear={true}
        >
          <div>Hello</div>
        </CSSTransition>
        <button onClick={ this.handleToggole }>toggle</button>
      </Fragment>
    )
  }

  handleToggole() {
    this.setState((prevState) => ({
      show: prevState.show ? false : true,
    }))
  }
}

export default App
