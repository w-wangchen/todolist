/**
 * @作者 wangchn86@163.com
 * @创建时间 2020/7/22 12:49 上午
 */
import React, { Component, Fragment } from 'react'
import { Tabs, TabPanel } from './Tabs'
import Pannel from './Panel'
import {
  SZCode,
  areaInfo,
} from './szCode'
import {
  postPointOrgInfo,
  getAreaBroderInfo,
} from './getData'
import './style.css'

class Map extends Component {

  constructor(props) {
    super(props)
    this.state = {
      backgroundImg: 'http://wechat.bluehy.com/img/map_bg.png',
      providerImg: 'http://banktest.longmap.com/model/tiles1/tiles/{z}/{x}/{y}.jpg',
      boundaryLayerArr: [],// 边界
      areaPointLayerArr: [],// 区域
      governingLayerArr: [],// 管辖行
      aacompanyLayerArr: [],// 同行
      activeTab: 0,
    }
    this.handleToggleTab = this.handleToggleTab.bind(this)
  }

  componentDidMount() {
    this.initMap()
    // this.renderMap()
  }

  render() {
    const { activeTab } = this.state
    return (
      <Fragment>
        <div id="container"></div>

        <Tabs activeTab={ activeTab }
              onClick={this.handleToggleTab}
        >
          <TabPanel label={'行政区'}>
            <Pannel/>
          </TabPanel>
          <TabPanel label={'管辖行'}>

          </TabPanel>
          <TabPanel label={'主要同业'}>

          </TabPanel>
          <TabPanel label={'业务指标'}>

          </TabPanel>
        </Tabs>
      </Fragment>
    )
  }

  // 百度地图初始化
  renderMap() {
    // 创建地图实例
    this.map = new window.BMapGL.Map('container')
    // 创建点坐标
    const point = new window.BMapGL.Point(116.404, 39.915)
    // 初始化地图，设置中心点坐标和地图级别
    this.map.centerAndZoom(point, 15)
  }

  initMap() {
    const { backgroundImg, providerImg, areaPointLayerArr } = this.state
    const maskColor = new window.LongMap.Color('#072058', 0.5)
    // 初始化地图
    this.map = new window.LongMap('container')
    this.map.setBackgroundImage(backgroundImg)
    this.map.addMask(maskColor)
    this.map.scene.screenSpaceCameraController.minimumZoomDistance = 3000
    // 添加底图
    const provider = this.map.addUrlProvider({
      url: providerImg,
      maximumLevel: 18,
    })
    // 添加路网
    const center = new window.LongMap.Point3(1.9941109702451678 * 180 / Math.PI, 0.3830358013412862 * 180 / Math.PI, 63268.839694592476)
    const duration = 0.1
    // 添加初始化地图
    this.initScene = this.map.addBoundary()

    // 区边界名称图层
    this.areaLayer = new window.LongMap.Layer()
    this.map.addLayer(this.areaLayer)

    // 区域中国银行图层
    const areaPointLayer = new window.LongMap.Layer()
    this.map.addLayer(areaPointLayer)

    this.resetScene(center, duration, this.initScene, this.areaLayer)
    // 场景添加区域信息
    this.sceneAddInfo(this.areaLayer)

    this.map.addEventListener('click', (event) => {
      const features = event.features[0]
      if (!features) return
      if (!features.msg) return
      const { name, position } = features.msg
      // 获取点击区域code
      const areaCode = SZCode[name]
      const point = new window.LongMap.Point3(...position, 29032)

      // 添加区域边框线
      this.addBorder(name)
      // 进行移动
      this.map.flyTo({
        point,
        complete: () => {
          // 隐藏初始化场景
          this.initScene.hide()
          // 区域图层名称隐藏
          this.areaLayer.hide()
          // 显示地图
          this.map.setSceneState(true)
          // 地图允许操作
          this.map.controlsEnabled(true)

          let data = {
            areaNo: areaCode,
          }
          this.areaPoint(data, areaPointLayer, name, areaPointLayerArr)

        },
      })


    })


  }

  // 初始管辖行区域信息
  resetScene(center, duration, initScene, areaLayer) {
    const { governingLayerArr, aacompanyLayerArr, areaPointLayerArr } = this.state
    this.map.flyTo({
      point: center,
      duration: duration,
      complete: () => {
        //使地图无法操作
        this.map.controlsEnabled(false)
        //隐藏底图
        this.map.setSceneState(false)

        console.log(this.boundaryLayer)
        // this.initScene.show()
        // for (let i = 0; i < governingLayerArr.length; i++) {
        //   this.map.removeLayer(governingLayerArr[i].layer)
        // }
        // for (let i = 0; i < aacompanyLayerArr.length; i++) {
        //   this.map.removeLayer(aacompanyLayerArr[i].layer)
        // }
        // for (let i = 0; i < areaPointLayerArr.length; i++) {
        //   this.map.removeLayer(areaPointLayerArr[i].layer)
        // }
        // // $('.bank-area p').removeClass('active')
        // areaLayer.show()
        // this.boundaryLayer.hide();


      },
    }, -42)

  }

  // 管辖行信息添加
  sceneAddInfo(areaLayer) {
    const _this = this
    console.log(1)
    const area = [...areaInfo]

    area.map((item, index) => {
      const { name, num, position } = item
      let text = name
      if (num > 0)
        text += ':' + num + '个'

      const data = {
        text,
        scale: 1,
        position: new window.LongMap.Point3(...position, 2000),
        color: new window.LongMap.Color('#144ea9'),
        offset: {
          x: -50,
          y: 0.5,
        },
      }

      this.addText(data, areaLayer)
    })
  }

  // 添加文字
  addText(data, layer) {
    const text = new window.LongMap.Text(data)
    if (layer)
      layer.addFeature(text)
    return text
  }

  //添加图标
  addSprite(data, layer) {
    const sprite = new window.LongMap.Sprite(data)
    if (layer)
      layer.addFeature(sprite)
    return sprite
  }

  // 区域对应银行点
  async areaPoint(data, layer, name, layerArr) {
    layerArr.push({
      name: name,
      'layer': layer,
    })
    // console.log('layerArr: ', layerArr)
    for (var k in data) {
      if (data[k] == '') {
        delete data[k]
      }
    }

    const res = await postPointOrgInfo(data)

    res.map((item, index) => {
      const { orgName, orgNo, belongNo, lon, lat } = item
      const sprite = this.addSprite({
        url: `http://wechat.bluehy.com/img/${ belongNo }.png`,
        position: new window.LongMap.Point3(lon, lat, 0),
        scale: 0.3,
        offset: {
          x: 0,
          y: -10,
        },
      }, layer)

      sprite.orgName = orgName
      sprite.orgNo = orgNo
      sprite.type = belongNo

      const textData = {
        text: orgName,
        scale: 1,
        position: new window.LongMap.Point3(lon, lat, 0),
        color: new window.LongMap.Color('#FF0000'),
        offset: {
          x: 20,
          y: 0,
        },
      }
      const text = this.addText(textData, layer)
    })

  }

  async addBorder(name) {
    const res = await getAreaBroderInfo()
    //区边界图层
    this.boundaryLayer = new window.LongMap.Layer()
    this.map.addLayer(this.boundaryLayer)
    this.setState((prevState) => {
      const { boundaryLayerArr } = prevState
      return {
        boundaryLayerArr: [...boundaryLayerArr, {
          name: name,
          'layer': this.boundaryLayer,
        }],
      }
    }, async () => {
      res.features.map((feature, index) => {
        if (feature.properties.name == name) {
          const points = []
          feature.geometry.coordinates[0][0].map((point) => {
            //84坐标转火星坐标
            const sp = window.wgs84togcj02(...point)
            points.push(new window.LongMap.Point3(...sp, 0))
          })
          //区域边界

          const line = new window.LongMap.Line({
            points: points,
            width: 3,
            color: new window.LongMap.Color('#6EFFFF'),
          })
          this.boundaryLayer.addFeature(line)
        }
      })

    })
  }


}


export default Map
