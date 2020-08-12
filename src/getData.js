/**
 * @作者 wangchn86@163.com
 * @创建时间 2020/8/7 2:58 下午
 */
import axios from './lib/api'
import {
  pathOr,
} from 'ramda'

const APP_ENV = 'dev'
const post = (path, params) => (

  axios.awaitpost(`${ config[APP_ENV]['site'] }${ path }`, params)
  .then(res => new Promise(resolve => {
      const data = pathOr([], ['data'], res)
      resolve(data)
    }),
  )
)

const get = (path) => (
  axios.awaitget(path)
  .then(res => new Promise(resolve => {
    resolve(res)
  }))
)

const postBankInfo = params =>
  post('/mapBankInfo/listMapBankInfo', params)

const postDepositLoanInfo = params =>
  post('/mapBankInfo/listMapBankInfo', params)

const postPointOrgInfo = params =>
  post('/mapBankInfo/listMapBankOrgInfo', params)


const getAreaBroderInfo = () =>
  get('http://wechat.bluehy.com/shenzhen.json')

export {
  postBankInfo,
  postDepositLoanInfo,
  postPointOrgInfo,
  getAreaBroderInfo,
}

const data = [
  {
    'id': 1,
    'orgNo': '17739',
    'orgName': '中国银行深圳龙岗支行',
    'orgLevel': '管辖',
    'orgAddress': '深圳市龙岗区中心城德政路龙财大楼1、7、8楼',
    'belongBank': '中国银行',
    'belongNo': 'boc',
    'areaName': '龙岗区',
    'areaNo': '440307',
    'lat': '22.723706',
    'lon': '114.247882',
    'riskLevel': null,
  },
  {
    'id': 2,
    'orgNo': '17752',
    'orgName': '中国银行深圳中心区支行',
    'orgLevel': '管辖',
    'orgAddress': '深圳市福田区福华三路100号鼎和大厦裙楼第1层01、03、04、05、06单元及第45层',
    'belongBank': '中国银行',
    'belongNo': 'boc',
    'areaName': '福田区',
    'areaNo': '440303',
    'lat': '22.53311',
    'lon': '114.062137',
    'riskLevel': null,
  },
  {
    'id': 3,
    'orgNo': '17716',
    'orgName': '中国银行深圳龙华支行',
    'orgLevel': '管辖',
    'orgAddress': '深圳市宝安区龙华镇人民路',
    'belongBank': '中国银行',
    'belongNo': 'boc',
    'areaName': '龙华区',
    'areaNo': '440309',
    'lat': '22.659762',
    'lon': '114.017811',
    'riskLevel': null,
  },
  {
    'id': 4,
    'orgNo': '17696',
    'orgName': '中国银行深圳宝安支行',
    'orgLevel': '管辖',
    'orgAddress': '深圳市宝安区新安街道宝兴路西侧万骏经贸大厦1栋一楼101、102、103、104、105、106、107、108、109、111、118号',
    'belongBank': '中国银行',
    'belongNo': 'boc',
    'areaName': '宝安区',
    'areaNo': '440306',
    'lat': '22.549521',
    'lon': '114.017811',
    'riskLevel': null,
  },
]

const config = {
  [APP_ENV]: {
    site: 'http://121.36.149.7:20010',
  },
}
