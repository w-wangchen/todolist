/**
 * @作者 wangchn86@163.com
 * @创建时间 2020/7/22 12:49 上午
 */
import React, { Component, Fragment } from 'react'
import Tabs from './Tabs'
import TabPanel from './Tabs/Panel'
import Pannel from './Panel'
import {
  SZCode,
  areaInfo,
  AreasData,
  AacompanysData,
  BusinessData,
} from './szCode'
import {
  postPointOrgInfo,
  getAreaBroderInfo,
} from './getData'
import {
  path,
  pathOr,
  assoc,
  assocPath,
  findIndex,
  find,
  propEq,
  isEmpty,
  equals,
  reject,
  filter,
} from 'ramda'
import './style.css'


class Map extends Component {

  constructor(props) {
    super(props)
    this.state = {
      backgroundImg: 'http://wechat.bluehy.com/img/map_bg.png',
      providerImg: 'http://banktest.longmap.com/model/tiles1/tiles/{z}/{x}/{y}.jpg',
      activeTab: 0,
      pannelAreas: AreasData,
      pannelGovernings: [],
      constPannelGovernings: [],
      pannelAacompanys: AacompanysData,
      pannelBusiness: BusinessData,
      center: '',
      areaLayer: '',
      boundaryLayer: '',// 边界图层
      areaPointLayer: '',// 区域点和文字图层
      governingLayer: '',// 管辖行
      aacompanyLayer: '',// 同业
      clickCode: '',// 获取地图上的机构号
    }
    this.handleToggleTab = this.handleToggleTab.bind(this)
    this.handleClickItem = this.handleClickItem.bind(this)
    this.handleBackMap = this.handleBackMap.bind(this)
  }

  componentDidMount() {
    this.initMap()
    // this.renderMap()
    this.initGxhPannelData()
  }

  handleToggleTab(activeCode) {
    //console.log(activeCode)
    this.setState(() => {
      return {
        activeTab: activeCode,
      }
    })
  }

  handleBackMap() {
    const { center } = this.state
    this.resetScene(center, 2, 'back')

  }

  handleClickItem(params) {
    console.log('params', params)
    this.state.areaLayer.hide()
    const onclick = pathOr(false, ['onclick'], params) ? false : true
    const obj = assoc('onclick', onclick, params)
    const stateName = pathOr('', ['stateName'], params)
    const code = pathOr('440304', ['code'], params)
    this.setState((prevState) => {
      const stateData = prevState[stateName]
      const index = findIndex(propEq('code', obj['code']))(stateData)
      const data = assocPath([index], obj)(stateData)
      return {
        [stateName]: data,
      }
    }, () => {
      const lon = +pathOr(114.161116, ['lon'], params)
      const lat = +pathOr(22.582173, ['lat'], params)
      const name = pathOr('罗湖区', ['name'], params)
      const areaName = pathOr('罗湖区', ['areaName'], params)
      const point = [lon, lat]
      // 行政区
      if (equals(stateName, 'pannelAreas')) {
        const AreasState = this.state.pannelAreas
        const item = find((i) => i.code === code)(AreasState)
        if (!item.onclick) {
          this.setState((prevState) => {
            const child = filter(propEq('code', code))(prevState.boundaryLayer.children)
            const childs = reject(propEq('code', code))(prevState.boundaryLayer.children)
            const child1 = filter(propEq('code', code))(prevState.areaPointLayer.children)
            const childs1 = reject(propEq('code', code))(prevState.areaPointLayer.children)
            if (!isEmpty(child)) {
              prevState.boundaryLayer.removeFeature(child[0])
            }
            if (!isEmpty(child1)) {
              child1.map(i => this.state.areaPointLayer.removeFeature(i))
            }
            const newBoundaryLayer = assoc(['children'], childs, this.state.boundaryLayer)
            const newAreaPointLayer = assoc(['children'], childs1, this.state.areaPointLayer)
            return {
              boundaryLayer: newBoundaryLayer,
              areaPointLayer: newAreaPointLayer,
            }
          })
          return false
        }
        // 移动
        this.move(point)
        // 添加区域
        this.addBorder(name, code)
        const data = {
          areaNo: code,
          belongNo: 'boc',
        }
        this.areaPoint(data, 'areaPointLayer', name, code)
      }
      // 管辖行
      if (equals(stateName, 'pannelGovernings')) {
        const pannelState = this.state.pannelGovernings
        const item = find((i) => i.code === code)(pannelState)
        console.log('item', item)
        if (!item.onclick) {
          this.setState((prevState) => {
            const child = filter(propEq('code', code))(prevState.boundaryLayer.children)
            const childs = reject(propEq('code', code))(prevState.boundaryLayer.children)
            const child1 = filter(propEq('code', code))(prevState.governingLayer.children)
            const childs1 = reject(propEq('code', code))(prevState.governingLayer.children)
            if (!isEmpty(child)) {
              prevState.boundaryLayer.removeFeature(child[0])
            }
            if (!isEmpty(child1)) {
              child1.map(i => this.state.governingLayer.removeFeature(i))
            }
            const newBoundaryLayer = assoc(['children'], childs, this.state.boundaryLayer)
            const newGoverningLayer = assoc(['children'], childs1, this.state.governingLayer)
            return {
              boundaryLayer: newBoundaryLayer,
              governingLayer: newGoverningLayer,
            }
          })
          return false
        }
        // 移动该管辖行
        this.move(point)
        // 添加管辖行区域点
        this.addBorder(areaName, code)
        // 绘制管辖行和图标
        const data = {
          orgNo: code,
          belongNo: 'boc',
        }
        this.areaPoint(data, 'governingLayer', name, code)
      }
      // 同业
      if (equals(stateName, 'pannelAacompanys')) {
        const aacompanyState = this.state.pannelAacompanys
        const item = find((i) => i.code === code)(aacompanyState)
        if (!item.onclick) {
          this.setState((prevState) => {
            const child1 = filter(propEq('code', code))(prevState.aacompanyLayer.children)
            const childs1 = reject(propEq('code', code))(prevState.aacompanyLayer.children)
            if (!isEmpty(child1)) {
              child1.map(i => this.state.aacompanyLayer.removeFeature(i))
            }
            const newAacompanyLayer = assoc(['children'], childs1, this.state.aacompanyLayer)
            return {
              aacompanyLayer: newAacompanyLayer,
            }
          })
          return false
        }
        // 移动到分行
        this.move(point)
        const data = {
          belongNo: code,
        }
        this.areaPoint(data, 'aacompanyLayer', name, code)

      }

    })

  }

  async initGxhPannelData() {
    const res = await postPointOrgInfo({
      belongNo: 'boc',
      orgLevel: '管辖',
    })
    const data = res.map((item, index) => {
      const { areaName, areaNo, belongNo, lon, lat, orgNo, orgName } = item
      const name = orgName.replace('中国银行深圳', '')
      return {
        areaName,
        areaNo,
        belongNo,
        lon,
        lat,
        code: orgNo,
        name,
        onclick: false,
        stateName: 'pannelGovernings',
      }
    })
    this.setState(() => {
      return {
        pannelGovernings: data,
        constPannelGovernings: data,
      }
    })
  }

  render() {
    const { activeTab, pannelAreas, pannelGovernings, pannelAacompanys, pannelBusiness } = this.state

    // console.log('render; ', pannelGovernings)
    return (
      <Fragment>
        <div id="container"></div>

        <Tabs activeTab={ activeTab }
              onClick={ this.handleToggleTab }
              onBack={ this.handleBackMap }
        >
          <TabPanel label={ '行政区' } sub={ 0 }>
            <Pannel clickItem={ this.handleClickItem }
                    className={ 'district' }
                    content={ pannelAreas }
            />
          </TabPanel>
          <TabPanel label={ '管辖行' } sub={ 1 }>
            <Pannel clickItem={ this.handleClickItem }
                    className={ 'governing' }
                    content={ pannelGovernings }
            />
          </TabPanel>
          <TabPanel label={ '主要同业' } sub={ 2 }>
            <Pannel clickItem={ this.handleClickItem }
                    className={ 'aacompany' }
                    content={ pannelAacompanys }
            />
          </TabPanel>
          {/*<TabPanel label={ '业务指标' } sub={ 3 }>*/ }
          {/*  <Pannel clickItem={ this.handleClickItem }*/ }
          {/*          className={ 'business' }*/ }
          {/*          content={ pannelBusiness }*/ }
          {/*  />*/ }
          {/*</TabPanel>*/ }
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
    const { backgroundImg, providerImg } = this.state
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


    this.setState((prevState) => {
      // 区边界名称图层
      const areaLayer = new window.LongMap.Layer()
      this.map.addLayer(areaLayer)
      //区边界图层
      const boundaryLayer = new window.LongMap.Layer()
      this.map.addLayer(boundaryLayer)
      // 区域中国银行图层
      const areaPointLayer = new window.LongMap.Layer()
      this.map.addLayer(areaPointLayer)
      // 管辖行
      const governingLayer = new window.LongMap.Layer()
      this.map.addLayer(governingLayer)
      // 同业
      const aacompanyLayer = new window.LongMap.Layer()
      this.map.addLayer(aacompanyLayer)

      return {
        center,
        areaLayer,
        boundaryLayer,
        areaPointLayer,
        governingLayer,
        aacompanyLayer,
      }
    }, () => {

      this.resetScene(center, duration)
      // 场景添加区域信息
      this.sceneAddInfo('areaLayer')

      this.map.addEventListener('click', (event) => {

        const features = event.features[0]
        if (!features) return
        if (!features.msg) return
        const { name, position } = features.msg
        // 获取点击区域code
        const areaCode = SZCode[name]
        const point = new window.LongMap.Point3(...position, 29032)

        this.setState((prevState) => {
          const stateData = prevState['pannelAreas']
          const index = findIndex(propEq('code', areaCode))(stateData)
          const data = assocPath([index, 'onclick'], true, stateData)
          return {
            pannelAreas: data,
          }
        }, () => {

          // 添加区域边框线
          this.addBorder(name, areaCode)

          const data = {
            areaNo: areaCode,
            belongNo: 'boc',
          }
          this.areaPoint(data, 'areaPointLayer', name, areaCode)
          // 进行移动
          this.map.flyTo({
            point,
            complete: () => {
              // 隐藏初始化场景
              this.initScene.hide()
              // 区域图层名称隐藏
              this.state.areaLayer.hide()
              // 显示地图
              this.map.setSceneState(true)
              // 地图允许操作
              this.map.controlsEnabled(true)
            },
          })
        })

      })
      // 点击获取机构号
      this.map.addEventListener('click', (event) => {
        const features = event.features[0]
        if (!features) return
        if (!features.orgNo) return
        const clickCode = features.orgNo
        this.setState((prevState) => {
          return {
            clickCode,
          }
        })
      })
      // 监听缩放
      // this.map.addEventListener('wheel', (event) => {
      //   console.log(this.map.camera._positionCartographic.height)
      // })

    })


  }

  // 初始管辖行区域信息
  resetScene(center, duration, type) {
    this.map.flyTo({
      point: center,
      duration: duration,
      complete: () => {
        //使地图无法操作
        this.map.controlsEnabled(false)
        //隐藏底图
        this.map.setSceneState(false)

        if (type === 'back') {
          this.setState((prevState) => {
            this.map.removeLayer(prevState.boundaryLayer)
            this.map.removeLayer(prevState.areaPointLayer)
            this.map.removeLayer(prevState.governingLayer)
            this.map.removeLayer(prevState.aacompanyLayer)
            //区边界图层
            const boundaryLayer = new window.LongMap.Layer()
            this.map.addLayer(boundaryLayer)
            // 区域中国银行图层
            const areaPointLayer = new window.LongMap.Layer()
            this.map.addLayer(areaPointLayer)
            // 管辖行
            const governingLayer = new window.LongMap.Layer()
            this.map.addLayer(governingLayer)
            // 同业
            const aacompanyLayer = new window.LongMap.Layer()
            this.map.addLayer(aacompanyLayer)
            return {
              pannelAreas: AreasData,
              pannelGovernings: prevState.constPannelGovernings,
              pannelAacompanys: AacompanysData,
              pannelBusiness: BusinessData,
              boundaryLayer,
              areaPointLayer,
              governingLayer,
              aacompanyLayer,
            }
          }, () => {
            this.initScene.show()
            // 场景添加区域信息
            this.state.areaLayer.show()
          })

        }
      },
    }, -42)

  }

  // 管辖行信息添加
  sceneAddInfo(areaLayer) {
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
  addText(data, sateLayer) {
    const text = new window.LongMap.Text(data)
    if (this.state[sateLayer])
      this.state[sateLayer].addFeature(text)
    this.setState({
      [sateLayer]: this.state[sateLayer],
    })
    return text
  }

  //添加图标
  addSprite(data, sateLayer) {
    console.log('addSprite_layer:', sateLayer)
    const sprite = new window.LongMap.Sprite(data)
    if (this.state[sateLayer])
      this.state[sateLayer].addFeature(sprite)
    this.setState({
      [sateLayer]: this.state[sateLayer],
    })
    return sprite
  }

  // 区域对应银行点
  async areaPoint(data, sateLayer, name, areaCode) {
    console.log('areaPoint', name, 'areaCode', areaCode)
    const res = await postPointOrgInfo(data)
    console.log(res)
    const index = findIndex(propEq('code', areaCode))(this.state[sateLayer].children)
    console.log('areaCode', areaCode, typeof index, index)
    if (index === -1) {
      console.log(123)
      res.map((item, index) => {
        const { orgName, orgNo, belongNo, lon, lat } = item
        let sprite = this.addSprite({
          url: require(`./img/${ belongNo }.png`),
          position: new window.LongMap.Point3(lon, lat, 0),
          scale: 0.3,
          offset: {
            x: 0,
            y: -10,
          },
        }, sateLayer)
        sprite.object._billboards[0].distanceDisplayCondition = new window.Cesium.DistanceDisplayCondition(10.0, 31788.0)

        sprite.orgName = orgName
        sprite.orgNo = orgNo
        sprite.belongNo = belongNo
        sprite.code = areaCode

        let textData = {
          text: orgName,
          scale: 1,
          position: new window.LongMap.Point3(lon, lat, 0),
          color: new window.LongMap.Color('#FF0000'),
          offset: {
            x: 20,
            y: 0,
          },
        }

        let text = this.addText(textData, sateLayer)
        text.orgName = orgName
        text.orgNo = orgNo
        text.belongNo = belongNo
        text.code = areaCode
        text.object._labels[0].distanceDisplayCondition = new window.Cesium.DistanceDisplayCondition(10.0, 31788.0)
      })
    }
  }

  async addBorder(name, code) {
    const res = await getAreaBroderInfo()
    const index = findIndex(propEq('code', code))(this.state.boundaryLayer.children)
    console.log(index)
    if ((index === -1))
      res.features.map((feature, index) => {
        if (feature.properties.name == name) {
          const points = []
          feature.geometry.coordinates[0][0].map((point) => {
            //84坐标转火星坐标
            const sp = window.wgs84togcj02(...point)
            points.push(new window.LongMap.Point3(...sp, 0))
          })

          let line = new window.LongMap.Line({
            points: points,
            width: 3,
            color: new window.LongMap.Color('#6EFFFF', 0.5),
          })
          line.code = code

          this.state.boundaryLayer.addFeature(line)
          this.setState({
            boundaryLayer: this.state.boundaryLayer,
          })
        }
      })

  }

  move(point) {
    this.map.flyTo({
      //位置
      point: new window.LongMap.Point3(...point, 21544),
      //完成回调
      complete: () => {
        //设置地图可以操作
        this.map.controlsEnabled(true)
        //设置地图可看到
        this.map.setSceneState(true)
        //隐藏初始化元素
        if (this.initScene) this.initScene.hide()
        //隐藏区域名称
        if (this.state.areaLayer) this.state.areaLayer.hide()
      },
    })
  }


}


export default Map
