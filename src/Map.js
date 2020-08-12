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
      boundaryLayerArr: [],// 边界
      areaPointLayerArr: [],// 区域
      governingLayerArr: [],// 管辖行
      aacompanyLayerArr: [],// 同行
      activeTab: 0,
      pannelAreas: AreasData,
      pannelGovernings: [],
      constPannelGovernings: [],
      pannelAacompanys: AacompanysData,
      pannelBusiness: BusinessData,
      center: '',
      boundaryLayer: '',// 边界图层
      areaPointLayer: '',// 区域点和文字图层
      clickCode:'',// 获取地图上的机构号
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
    console.log('back')
    const { center } = this.state
    this.resetScene(center, 2, 'back')

  }

  handleClickItem(params) {
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
            console.log('child1', child1)
            console.log('childs1', childs1)
            if (!isEmpty(child)) {
              console.log(child[0])
              this.state.boundaryLayer.removeFeature(child[0])
            }
            if (!isEmpty(child1)){
              console.log(child1[0])
              console.log(child1[1])
              this.state.areaPointLayer.removeFeature(child1[0])
              // this.state.areaPointLayer.removeFeature(child1[1])
              console.log(this.state.areaPointLayer)
            }
            const newBoundaryLayer = assoc(['children'], childs, this.state.boundaryLayer)
            const newAreaPointLayer = assoc(['children'], childs, this.state.areaPointLayer)
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
        this.areaPoint(data, this.state.areaPointLayer, name, 'areaPointLayerArr', code)
      }
      // 管辖行
      if (equals(stateName, 'pannelGovernings')) {
        // 移动该管辖行
        this.move(point)
        // 添加管辖行区域点

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

    this.setState((prevState) => {

      //区边界图层
      const boundaryLayer = new window.LongMap.Layer()
      this.map.addLayer(boundaryLayer)
      // 区域中国银行图层
      const areaPointLayer = new window.LongMap.Layer()
      this.map.addLayer(areaPointLayer)
      return {
        center,
        boundaryLayer,
        areaPointLayer,
      }
    }, () => {

      this.resetScene(center, duration)

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
        // code 对应看板
        this.setState((prevState) => {
          const stateData = prevState['pannelAreas']
          const index = findIndex(propEq('code', areaCode))(stateData)
          const data = assocPath([index, 'onclick'], true, stateData)
          return {
            pannelAreas: data,
          }
        }, () => {

          console.log('initMap this.map.flyTo')
          // 添加区域边框线
          this.addBorder(name, areaCode)
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

              const data = {
                areaNo: areaCode,
                belongNo: 'boc',
              }
              this.areaPoint(data, this.state.areaPointLayer, name, 'areaPointLayerArr', areaCode)

            },
          })

        })


      })

      // 点击获取机构号
      this.map.addEventListener('click', (event)=>{
        const features = event.features[0]
        if(!features) return
        if(!features.code) return
        const clickCode = features.code
        this.setState((prevState)=>{
          return {
            clickCode,
          }
        })
      })


    })




  }

  // 初始管辖行区域信息
  resetScene(center, duration, type) {
    console.log(123)
    const { governingLayerArr, aacompanyLayerArr, areaPointLayerArr } = this.state
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
            return {
              pannelAreas: AreasData,
              pannelGovernings: prevState.constPannelGovernings,
              pannelAacompanys: AacompanysData,
              pannelBusiness: BusinessData,
              boundaryLayer: new window.LongMap.Layer(),
            }
          }, () => {
            this.initScene.show()
            // const { areaPointLayerArr, aacompanyLayerArr, governingLayerArr } = this.state
            // console.log('areaPointLayerArr:', areaPointLayerArr)
            // areaPointLayerArr.forEach(i => {
            //   this.map.removeLayer(i.layer)
            // })
            // aacompanyLayerArr.forEach(i => this.map.removeLayer(i.layer))
            // governingLayerArr.forEach(i => this.map.removeLayer(i.layer))
            // console.log('this.boundaryLayer', this.boundaryLayer)
            // console.log('this.areaPointLayer', this.areaPointLayer)
            // this.areaLayer.show()
            // // this.boundaryLayer.children.forEach(i=> )
            // this.areaPointLayer.hide()
            //
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
  async areaPoint(data, layer, name, layerArr, areaCode) {
    const res = await postPointOrgInfo(data)
    const index = findIndex(propEq('code', areaCode))(this.state.areaPointLayer.children)
    console.log(index)
    if (index === -1)
      res.map((item, index) => {
        const { orgName, orgNo, belongNo, lon, lat } = item
        let sprite = this.addSprite({
          url: `http://wechat.bluehy.com/img/${ belongNo }.png`,
          position: new window.LongMap.Point3(lon, lat, 0),
          scale: 0.3,
          offset: {
            x: 0,
            y: -10,
          },
        }, layer)
        // sprite.object._billboards[0].distanceDisplayCondition = new window.Cesium.DistanceDisplayCondition(
        //   10.0, 25000.0)

        sprite.orgName = orgName
        sprite.orgNo = orgNo
        sprite.type = belongNo
        sprite.code = areaCode

        // let textData = {
        //   text: orgName,
        //   scale: 1,
        //   position: new window.LongMap.Point3(lon, lat, 0),
        //   color: new window.LongMap.Color('#FF0000'),
        //   offset: {
        //     x: 20,
        //     y: 0,
        //   },
        // }
        //
        // let text = this.addText(textData, layer)
        // text.code = areaCode
        // text.object._labels[0].distanceDisplayCondition=new window.Cesium.DistanceDisplayCondition(10.0, 25000.0);
      })

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
        }
      })

  }

  move(point) {
    this.map.flyTo({
      //位置
      point: new window.LongMap.Point3(...point, 19032),
      //完成回调
      complete: () => {
        //设置地图可以操作
        this.map.controlsEnabled(true)
        //设置地图可看到
        this.map.setSceneState(true)
        //隐藏初始化元素
        if (this.initScene) this.initScene.hide()
        //隐藏区域名称
        if (this.areaLayer) this.areaLayer.hide()
        //显示银行图标点
        if (this.bankLayer) this.bankLayer.show()
        //隐藏区域边界
        if (this.boundaryLayer) this.boundaryLayer.show()
      },
    })
  }


}


export default Map
