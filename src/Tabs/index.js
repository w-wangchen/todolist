/**
 * @作者 wangchn86@163.com
 * @创建时间 2020/8/10 6:14 下午
 */
import React, { Component, Fragment } from 'react'
import Tab from './Tab'
import PropTypes from 'prop-types'
import './index.css'

import Widget from '../Panel'

class Tabs extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    const { children, onClick, activeTab } = this.props
    console.log('children: ', children)
    return (
      <div className={ 'container' }>
        <div className={ 'container-header' }>
          { children.map((item, index) => {
            const { label } = item.props
            return <Tab key={ index }
                        index={ index }
                        label={ label }
                        onClick={ onClick }
                        activeTab={ activeTab }
            />
          }) }
        </div>
        <div className={ 'bank-area' }>
          {
            children.map((item, index) => {
              const { sub, children } = item.props
              if (sub === activeTab)
                return children
            })
          }
        </div>


      </div>
    )
  }
}

Widget.propTypes = {
  children: PropTypes.element,
  onClick: PropTypes.func,
  activeTab: PropTypes.string,
}

Widget.defaultProps = {}

export default Tabs
