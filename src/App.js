/**
 * @作者 wangchn86@163.com
 * @创建时间 2020/8/7 11:48 下午
 */
import React, { Component, Fragment } from 'react'
import './style.css'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      show: true,
    }
    this.handleSwitchShow = this.handleSwitchShow.bind(this)
  }

  render() {
    const { show } = this.state
    return (
      <Fragment>
        <div className={ show ? 'show' : 'hidden' }>Hello</div>
        <button onClick={ this.handleSwitchShow }>toggle</button>
      </Fragment>
    )
  }

  handleSwitchShow() {
    this.setState((prevState) => ({
      show: prevState.show ? false : true,
    }))
  }
}

export default App
