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
    const {content, handleClieckItem} = this.props
    return (
      <div className={'district bank-area'}>
        {
          content.map((item,index)=>{
            const {areaName, areaCode} = item
            return <p key={areaCode}
                      onClick={handleClieckItem}>{areaName}</p>
          })
        }
      </div>
    )
  }
}


Widget.propTypes = {
  content: PropTypes.array,

}

Widget.defaultProps = {
  content: [
    { areaName: '罗湖区', areaCode: "440304" },
    { areaName: '福田区', areaCode: "440303" },
    { areaName: '南山区', areaCode: "440305" },
    { areaName: '盐田区', areaCode: "440308" },
    { areaName: '龙岗区', areaCode: "440307" },
    { areaName: '宝安区', areaCode: "440306" },
    { areaName: '龙华区', areaCode: "440309" },
    { areaName: '坪山区', areaCode: "440310" },
    { areaName: '光明区', areaCode: "440311" },
    { areaName: '大鹏区', areaCode: "440312" },
  ],
}


export default Widget
