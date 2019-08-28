/* 设备管理 */
import ajax from '@/utils/ajax'

const actions = {
  /* 1 设备列表 */
  'a:device/find' ({commit}, params) {
    return ajax.api({
      cmd: 'ime-config/param/find',
      ...params
    })
  },
  /* 获取设备参数集 */
  'a:device/getAll' ({commit}, params) {
    return ajax.api({
      cmd: 'ime-config/paramVersion/getAll',
      parameters: params
    })
  },
  /* 参数类别 */
  'a:device/category/getAll' ({commit}, params) {
    return ajax.api({
      cmd: 'ime-config/category/getAll',
      parameters: params
    })
  }
}

export default {
  actions
}
