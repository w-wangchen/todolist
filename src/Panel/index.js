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
    //console.log(this.props)
    return (
      <Fragment>
        {
          content.map((item, index) => {
            const { areaName, code } = item
            return <p key={ code }
                      onClick={ this.handleClick.bind(this, code) }>{ areaName }</p>
          })
        }
      </Fragment>
    )
  }

  handleClick(code) {
    const { clickItem } = this.props
    clickItem(code)
  }
}

Widget.propTypes = {
  content: PropTypes.array,
  clickItem: PropTypes.func,
}

Widget.defaultProps = {
  content: [
    { areaName: '罗湖区', code: '440304' },
    { areaName: '福田区', code: '440303' },
    { areaName: '南山区', code: '440305' },
    { areaName: '盐田区', code: '440308' },
    { areaName: '龙岗区', code: '440307' },
    { areaName: '宝安区', code: '440306' },
    { areaName: '龙华区', code: '440309' },
    { areaName: '坪山区', code: '440310' },
    { areaName: '光明区', code: '440311' },
    { areaName: '大鹏区', code: '440312' },
  ],

}


export default Widget
