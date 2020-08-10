/**
 * @作者 wangchn86@163.com
 * @创建时间 2020/7/22 12:49 上午
 */
import React, { Component, Fragment } from 'react'
import './style.css'

class Widget extends Component {

  constructor(props) {
    super(props)
    this.state = {
      backgroundImg: 'http://wechat.bluehy.com/img/map_bg.png',
      providerImg: 'http://banktest.longmap.com/model/tiles1/tiles/{z}/{x}/{y}.jpg',
      governingLayerArr: [],
      aacompanyLayerArr: [],
      areaPointLayerArr: [],
    }
  }

  componentDidMount() {
    this.initMap()
    // this.renderMap()
  }

  render() {

    return (
      <div id="container"></div>
    )
  }

  // 百度地图初始化
  renderMap() {
    this.map = new window.BMapGL.Map('container')
    // 创建地图实例
    const point = new window.BMapGL.Point(116.404, 39.915)
    // 创建点坐标
    this.map.centerAndZoom(point, 15)
    // 初始化地图，设置中心点坐标和地图级别
  }

  initMap() {
    const { backgroundImg, providerImg } = this.state
    const maskColor = new window.LongMap.Color('#072058', 0.5)
    // 初始化地图
    this.map = new window.LongMap('container')
    this.map.setBackgroundImage(backgroundImg)
    this.map.addMask(maskColor)
    this.map.scene.screenSpaceCameraController.minimumZoomDistance = 3000
    // 添加初始化场景
    const initScene = this.map.addBoundary()
    // 添加底图
    console.log('provider')
    const provider = this.map.addUrlProvider({
      url: providerImg,
      maximumLevel: 18,
    })
    // 添加路网
    const center = new window.LongMap.Point3(1.9941109702451678 * 180 / Math.PI, 0.3830358013412862 * 180 / Math
      .PI, 63268.839694592476)
    // 银行图层
    const bankLayer = new window.LongMap.Layer()
    this.map.addLayer(bankLayer)
    // 隐藏
    bankLayer.hide()

    // 区边界名称图层
    const areaLayer = new window.LongMap.Layer()
    this.map.addLayer(areaLayer)

    this.resetScene(center, 0.1, initScene, areaLayer)

  }

  resetScene(center, duration, initScene, areaLayer) {
    const { governingLayerArr, aacompanyLayerArr, areaPointLayerArr } = this.state
    this.map.flyTo({
      point: center,
      duration: duration,
      complete: () => {
        console.log('this: ', this.map)
        //使地图无法操作
        this.map.controlsEnabled(false)
        //隐藏底图
        this.map.setSceneState(false)

        initScene.show()
        for (let i = 0; i < governingLayerArr.length; i++) {
          this.map.removeLayer(governingLayerArr[i].layer)
        }
        for (let i = 0; i < aacompanyLayerArr.length; i++) {
          this.map.removeLayer(aacompanyLayerArr[i].layer)
        }
        for (let i = 0; i < areaPointLayerArr.length; i++) {
          this.map.removeLayer(areaPointLayerArr[i].layer)
        }
        // $('.bank-area p').removeClass('active')
        areaLayer.show()
        // boundaryLayer.hide();


      },
    }, -42)

  }


}

export default Widget
