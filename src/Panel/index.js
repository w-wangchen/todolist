/**
 * @作者 wangchn86@163.com
 * @创建时间 2020/8/10 6:14 下午
 */
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import './index.css'

class Widget extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { content } = this.props
    console.log(this.props)
    return (
      <Fragment>
        {/*{*/}
        {/*  content.map((item, index) => {*/}
        {/*    const { areaName, code } = item*/}
        {/*    return <p key={ code }*/}
        {/*              onClick={ this.handleClick.bind(this, code) }>{ areaName }</p>*/}
        {/*  })*/}
        {/*}*/}
      </Fragment>
    )
  }

  handleClick(code) {
    const { clickItem } = this.props
    clickItem(code)
  }
}

Widget.propTypes = {
  content: PropTypes.number,
  clickItem: PropTypes.func,
}

Widget.defaultProps = {

}


export default Widget
