/* 设备管理 */
import ajax from '@/utils/ajax'

const actions = {
  /* box增效数据查询 */
  'a:efficiency/getMtsDaysSum' ({commit}, params) {
    return ajax.api({
      cmd: 'box/boxTotalManager/getMtsDaysSum',
      ...params
    })
  },
  /* box增效异常查询 */
  'a:efficiency/getErrorTime' ({commit}, params) {
    return ajax.api({
      cmd: 'box/boxTotalManager/getErrorTime',
      ...params
    })
  }
}

export default {
  actions
}
