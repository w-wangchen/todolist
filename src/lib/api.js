/*
 */
import wasabiapi from 'wasabi-api'
import config from './config'
import unit from './unit'
// import Mssaege from './Message'

let ajax = function (settings) {

  let headers = getHeaders()
  //说明要对接用管系统
  if (!unit.isEmptyObject(headers)) {
    settings.headers = settings.headers instanceof Object ? Object.assign(settings.headers, headers) : headers

    let success = unit.clone(settings.success)//复制一份
    //默认错误
    settings.error = settings.error ? settings.error : (message) => {
      // Mssaege.error(message)
    }
    settings.success = (res) => {

      if (res && res.code && res.code == '401') {
        window.parent.postMessage(JSON.stringify({ msg: 'token过期' }), '*')

        settings.error(res.message)
      } else if (res && res.code && res.code != '200') {
        settings.error(res.message)
      } else {
        success && success(res)
      }
    }
  }
  wasabiapi.ajax(settings)
}

let fetch = async function (fetchModel) {

  let headers = getHeaders()
  fetchModel.headers = fetchModel.headers && fetchModel.headers instanceof Object ? Object.assign(fetchModel.headers, headers) : {}
  let res = await wasabiapi.fetch(fetchModel)

  // console.log(res)
  try {

    if (res && res.code && res.code == '401') {
      window.parent.postMessage(JSON.stringify({ msg: 'token过期' }), '*')
      return ('登陆失效') //返回json格式的数据
    } else if (res && res.code && res.code != '200') {

      //失败
      return (res.message) //返回错误
    } else {//成功
      if (typeof res == 'string') {
        return (res) //返回错误
      } else {
        return (res) //返回json格式的数据
      }
    }
  } catch (err) {
    return (err.message) //返回错误
  }

}
let getHeaders = function () {

  let token = unit.GetArgsFromHref(window.location.href, 'token') ? unit.GetArgsFromHref(window.location.href, 'token') : window.sessionStorage.getItem('token')
  let headers = {}
  if (token) {
    let userId = unit.GetArgsFromHref(window.location.href, 'userId') ? unit.GetArgsFromHref(window.location.href, 'token') : window.sessionStorage.getItem('userId')
    let perId = unit.GetArgsFromHref(window.location.href, 'perId') ? unit.GetArgsFromHref(window.location.href, 'perId') : window.sessionStorage.getItem('perId')
    let sysId = unit.GetArgsFromHref(window.location.href, 'sysId') ? unit.GetArgsFromHref(window.location.href, 'sysId') : window.sessionStorage.getItem('sysId')

    window.sessionStorage.setItem('token', token)
    window.sessionStorage.setItem('userId', userId)
    window.sessionStorage.setItem('perId', perId)
    window.sessionStorage.setItem('sysId', sysId)

    let url = window.location.href
    url = url ? url.replace(window.location.origin, '') : url
    let rock = config.rock//密钥

    headers.token = token
    headers.sysId = sysId
    headers.perId = perId
    headers.dateTime = new Date().getTime()//时间
    headers.ciphertext = wasabiapi.crypto(token + sysId + perId + url + rock + headers.dateTime, 'SHA256')//加密字符串

  }
  return headers


}

let location = function () {

  let path = unit.GetArgsFromHref(window.location.href, 'path')//如果有地
  //if(window.location.href.indexOf("token")>-1){
  if (window.location.href.indexOf('typtUserInfo') > -1) {//说明是用管系统过来的
    //绝对定位，改成相对
    path = path.indexOf('./') <= -1 ? path.replace('/', './') : path
    if (path == '' || path == './') {
      //默认页跳转到home

      path = './home.html'
    }
    window.location.href = path + window.location.search//
  }


}
let message = function (that) {

  if (window.location.href.indexOf('typtUserInfo') > -1) {//说明是用管系统过来的

    //默认页,首页添加监听
    window.addEventListener('message', (event) => {
      console.log('用户信息', event.data, '用户信息类型', typeof event.data)
      let data = event.data

      if (data && typeof data == 'string') {//如果是字符串
        data = JSON.parse(data)
      } else {
        console.log('输出用户信息', typeof data)
      }
      if (data && data.userName) {
        console.log('成功拿到用户', data)
        //确定是用户信息
        if (that) {
          that.setState({
            userInfo: data,
          })
        }

        window.sessionStorage.setItem('userInfo', JSON.stringify(data))
        console.log('用户信息', data)


      }
    }, false)


  }


}

let crpto = function (url) {
  let headers = getHeaders(url)
  if (headers.token) {
    let str = 'token=' + headers.token + '&sysId=' + headers.sysId + '&perId=' + headers.perId + '&ciphertext=' + headers.ciphertext + '&dateTime=' + headers.dateTime
    if (url.indexOf('?') > -1) {
      url += '&' + str
    } else {

      url += '?' + str
    }
  }

  return url
}

/**
 *
 * @param {*} url
 * @param {*} success
 */
let get = function (url, success) {
  let settings = {
    url: url,
    type: 'get',
    success: success,
  }
  ajax(settings)

}
let post = function (url, data, success) {
  let settings = {
    url: url,
    type: 'post',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: success,
  }
  ajax(settings)

}

let awaitget = function (url) {

  let res = fetch({
    url: url,
    type: 'get',
  })

  return res
}

let awaitpost = function (url, data) {

  let res = fetch({
    type: 'post',
    url: url,
    contentType: 'application/json',
    data: JSON.stringify(data),

  })
  return res
}


export default { ajax, fetch, get, post, awaitget, awaitpost, location, message, crpto }
