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
    const { content, className } = this.props
    // console.log(this.props)
    return (
      <Fragment>
        {
          content.map((item, index) => {
            const { name, code } = item

            const areaName = item.areaName || ''
            const areaNo = item.areaNo || ''
            const belongNo = item.belongNo || ''
            const lon = item.lon || ''
            const lat = item.lat || ''
            const onclick = item.onclick || false
            const stateName = item.stateName || ''
            return <p key={ code }
                      className={ onclick ? `${ className } active` : className }
                      onClick={ this.handleClick.bind(this, {
                        code,
                        areaName,
                        areaNo,
                        belongNo,
                        lon,
                        lat,
                        onclick,
                        stateName,
                        name,
                      }) }>{ name }</p>
          })
        }
      </Fragment>
    )
  }

  handleClick(params) {
    const { clickItem } = this.props
    clickItem(params)
  }
}

Widget.propTypes = {
  content: PropTypes.array,
  clickItem: PropTypes.func,
}

Widget.defaultProps = {
  content: [
    { name: '罗湖区', code: '440304', onclick: false, stateName: 'pannelAreas' },
    { name: '福田区', code: '440303', onclick: false, stateName: 'pannelAreas' },
    { name: '南山区', code: '440305', onclick: false, stateName: 'pannelAreas' },
    { name: '盐田区', code: '440308', onclick: false, stateName: 'pannelAreas' },
    { name: '龙岗区', code: '440307', onclick: false, stateName: 'pannelAreas' },
    { name: '宝安区', code: '440306', onclick: false, stateName: 'pannelAreas' },
    { name: '龙华区', code: '440309', onclick: false, stateName: 'pannelAreas' },
    { name: '坪山区', code: '440310', onclick: false, stateName: 'pannelAreas' },
    { name: '光明区', code: '440311', onclick: false, stateName: 'pannelAreas' },
    { name: '大鹏区', code: '440312', onclick: false, stateName: 'pannelAreas' },
  ],

}


export default Widget
