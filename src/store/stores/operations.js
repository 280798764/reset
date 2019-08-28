/* 运维管理接口 */
import ajax from '@/utils/ajax'

const actions = {
  /* 获取vpn列表 */
  'a:operations/getVpnList' ({commit}, params) {
    return ajax.api({
      cmd: 'box/vpnManager/getVpnList',
      ...params
    })
  },
  /* 获取基本信息 */
  'a:operations/getVpnBasicMsg' ({commit}, params) {
    return ajax.api({
      cmd: 'box/vpnManager/getVpnBasicMsg',
      parameters: params
    })
  },
  /*  sim-列表 */
  'a:operations/getSimList' ({commit}, params) {
    return ajax.api({
      cmd: 'box/simManager/getSimList',
      ...params
    })
  },
  /* sim-列表（新） */
  'a:operations/selectSimList' ({commit}, params) {
    return ajax.api({
      cmd: 'box/simManager/selectSimList',
      ...params
    })
  },
  /* 获取sim状态列表 */
  'a:operations/getCardStatusList' ({commit}, params) {
    return ajax.api({
      cmd: 'box/simManager/getCardStatusList',
      parameters: params
    })
  },
  /* 获取所属群组列表 */
  'a:operations/getGroupList' ({commit}, params) {
    return ajax.api({
      cmd: 'box/simManager/getGroupList',
      parameters: params
    })
  },
  /* sim - 删除 */
  'a:operations/simDdelete' ({commit}, params) {
    return ajax.api({
      cmd: 'box/simManager/delete',
      parameters: params
    })
  },
  /* sim - 修改 */
  'a:operations/update' ({commit}, params) {
    return ajax.api({
      cmd: 'box/simManager/update',
      parameters: params
    })
  },
  /* sim 详情 */
  'a:operations/selectSimInfo' ({commit}, params) {
    return ajax.api({
      cmd: 'box/simManager/selectSimInfo',
      parameters: params
    })
  },
  /* sim详情 流量列表（新） */
  'a:operations/selectFlowList' ({commit}, params) {
    return ajax.api({
      cmd: 'box/simManager/selectFlowList',
      ...params
    })
  },
  /* 获取sim卡位置 */
  'a:operations/getSimAdress' ({commit}, params) {
    return ajax.api({
      cmd: 'box/simMsg/getAdress',
      parameters: params
    })
  },
  /* 查询位置信息 */
  'a:operations/queryBdLocation' ({commit}, params) {
    return ajax.bdMapApi(
      {lat: params.lat, lng: params.lng}, params.ak
    )
  },
  /* 流量池统计 */
  'a:operations/selectLastPool' ({commit}, params) {
    return ajax.api({
      cmd: 'box/simPool/selectLastPool',
      parameters: params
    })
  },
  /* 流量池列表 */
  'a:operations/getList' ({commit}, params) {
    return ajax.api({
      cmd: 'box/simPool/getList',
      ...params
    })
  },
  /* 流量预警列表 */
  'a:operations/getWarnList' ({commit}, params) {
    return ajax.api({
      cmd: 'box/simWarn/getWarnList',
      parameters: params
    })
  },
  /* 预警线获取 */
  'a:operations/getWranVal' ({commit}, params) {
    return ajax.api({
      cmd: 'box/simWarn/getWranVal',
      parameters: params
    })
  },
  /* 修改预警线获取 */
  'a:operations/updateWranVal' ({commit}, params) {
    return ajax.api({
      cmd: 'box/simWarn/updateWranVal',
      parameters: params
    })
  },
  /* 流量预警详情 */
  'a:operations/selectFailList' ({commit}, params) {
    return ajax.api({
      cmd: 'box/simWarn/selectFailList',
      ...params
    })
  }
}

export default {
  actions
}
