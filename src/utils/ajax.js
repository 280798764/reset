/* 访问Wms项目 */
import axios from 'axios'
import {DOMAIN, TOKEN_NAME} from '@/utils/config'

axios.defaults.baseURL = DOMAIN.apiPath

export default {
  // 登陆后私有接口使用
  api (data) {
    return new Promise((resolve, reject) => {
      data.userToken = sessionStorage.getItem(TOKEN_NAME)
      axios.post('/', data).then(
        res => {
          let resData = res.data
          if (resData.error) {
            // 登陆失败
            if (resData.error.errorCode === '100' || resData.error.errorCode === 100) {
              // 重定向到登陆页面
              sessionStorage.clear()
              window.location.pathname = ''
            } else {
              reject(resData.error)
            }
          } else {
            resolve(resData.response)
          }
        }
      ).catch(
        res => {
          const error = {
            errorCode: res.status,
            errorInfo: '服务器开小差了~~'
          }
          reject(error)
        }
      )
    })
  },
  // 无需登录公有接口使用
  apiPublic (params) {
    return new Promise((resolve, reject) => {
      axios.post('/', params).then(
        res => {
          if (res.data.error) {
            reject(res.data.error)
          } else {
            resolve(res.data.response)
          }
        }
      ).catch(
        res => {
          const error = {
            errorCode: res.status,
            errorInfo: res.statusText
          }
          reject(error)
        }
      )
    })
  },
  // 文件上传至自家服务器
  apiFileUpload (file, cmd) {
    return new Promise((resolve, reject) => {
      let formData = new FormData()
      formData.append('file', file)
      formData.append('userToken', sessionStorage.getItem('userToken'))
      axios.post(cmd, formData).then(
        res => {
          if (res.data.success === false) {
            reject(res.data.msg)
          } else {
            resolve(res.data.msg)
          }
        }
      ).catch(
        res => {
          const error = {
            errorCode: res.status,
            errorInfo: '服务器开小差了~~'
          }
          reject(error)
        }
      )
    })
  },
  // 获取文件上传至七牛需要的token
  apiGetQiNiuToken () {
    return new Promise((resolve, reject) => {
      this.apiPublic({
        cmd: 'support/file/requestUploadToken',
        parameters: {
          appID: 'oncall',
          appCode: '',
          appType: '',
          bizId: 1
        }
      }).then(
        res => {
          resolve(res)
        },
        rej => {
          reject(rej)
        }
      )
    })
  },
  // 文件上传至七牛
  apiUploadQiNiu (file) {
    return new Promise((resolve, reject) => {
      this.apiPublic({
        cmd: 'support/file/requestUploadToken',
        parameters: {
          appID: 'oncall',
          appCode: '',
          appType: '',
          bizId: 1
        }
      }).then(
        res => {
          let token = res
          let formData = new window.FormData()
          formData.append('token', token)
          formData.append('file', file)
          return axios.post(DOMAIN.qiNiu, formData).then(
            res => {
              resolve(res.data)
            },
            rej => {
              resolve(rej)
            }
          )
        },
        rej => {
          console.log(rej.errorInfo)
          resolve(rej)
        })
    })
  },
  bdMapApi (point, ak) {
    return new Promise((resolve, reject) => {
      // http://api.map.baidu.com/reverse_geocoding/v3/?
      // http://api.map.baidu.com/geocoder/v2/?
      axios.get('https://bird.ioliu.cn/v1/?url=http://api.map.baidu.com/geocoder/v2/?coordtype=wgs84ll&extensions_poi=0&location=' + point.lat + ',' + point.lng + '&output=json&ak=' + ak + '&jsoncallback=?'
        , {timeout: 10000}).then(
        res => {
          if (res.data.status === 0) {
            resolve(res.data.result.addressComponent)
          } else {
            const error = {
              errorCode: res.data.status,
              errorInfo: '服务器开小差了~~'
            }
            reject(error)
          }
        }
      ).catch(function (err) {
        console.log('fail', err)
      }
        // res => {
        //   const error = {
        //     errorCode: res.status,
        //     errorInfo: '服务器开小差了~~'
        //   }
        //   reject(error)
        // }
      )
    })
  }
}
