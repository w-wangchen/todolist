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


const config = {
  [APP_ENV]: {
    site: 'http://121.36.149.7:20010',
  },
}
