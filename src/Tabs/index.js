/**
 * @作者 wangchn86@163.com
 * @创建时间 2020/8/10 6:14 下午
 */
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import Tab from './Tab'
import arrowURL from '../img/arrow.png'
import './index.css'


class Widget extends Component {

  constructor(props) {
    super(props)
    this.state = {
      slide: true,
    }
    this.handleSlideToggle = this.handleSlideToggle.bind(this)
  }

  render() {
    const { slide } = this.state
    const { children, onClick, activeTab } = this.props
    //console.log('children: ', children)
    return (
      <div className={ slide ? 'container show' : 'container hidden' }>
        <div className={ 'back' }>返回</div>
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
        <div className={ slide ? 'bank-area visible' : 'bank-area none'}>
          {
            children.map((item, index) => {
              const { sub, children } = item.props
              if (sub === activeTab)
                return children
            })
          }
        </div>
        <div className={ 'arrow' }
             onClick={ this.handleSlideToggle }>
          <img src={ arrowURL }/>
        </div>
      </div>
    )
  }

  handleSlideToggle() {
    this.setState((prevState) => {
      return {
        slide: prevState.slide ? false : true,
      }
    })
  }
}

Widget.propTypes = {
  children: PropTypes.array,
  onClick: PropTypes.func,
  activeTab: PropTypes.number,
}

Widget.defaultProps = {}

export default Widget
