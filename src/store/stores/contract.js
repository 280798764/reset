/* 设备管理 */
import ajax from '@/utils/ajax'

const actions = {
  /* 合同列表 */
  'a:contract/getContractList' ({commit}, params) {
    return ajax.api({
      cmd: 'box/contractManager/getContractList',
      ...params
    })
  },
  /* 详情下设备列表 */
  'a:contract/getAgreementList' ({commit}, params) {
    return ajax.api({
      cmd: 'box/contractMachineManager/getAgreementList',
      ...params
    })
  },
  /* 合同状态 */
  'a:contract/getStatusList' ({commit}, params) {
    return ajax.api({
      cmd: 'box/contractManager/getStatusList',
      parameters: params
    })
  },
  /* 数量统计 */
  'a:contract/getTotalStatistics' ({commit}, params) {
    return ajax.api({
      cmd: 'box/contractManager/getTotalStatistics',
      parameters: params
    })
  },
  /* 设备实施状态列表 */
  'a:contract/getImplStatusList' ({commit}, params) {
    return ajax.api({
      cmd: 'box/contractManager/getImplStatusList',
      parameters: params
    })
  },
  /* 查看记录 --派工列表 */
  'a:contract/getWorkList' ({commit}, params) {
    return ajax.api({
      cmd: 'box/contractManager/getWorkList',
      ...params
    })
  },
  /* 详情 */
  'a:contract/getContract' ({commit}, params) {
    return ajax.api({
      cmd: 'box/contractManager/getContract',
      parameters: params
    })
  },
  /* BOX派工历史 */
  'a:contract/selectBoxSendList' ({commit}, params) {
    return ajax.api({
      cmd: 'box/sendWorkMachineManager/selectBoxSendList',
      ...params
    })
  },
  /* 设备详情 */
  'a:contract/getBoxByNo' ({commit}, params) {
    return ajax.api({
      cmd: 'box/contractMachineManager/getBoxByNo',
      parameters: params
    })
  },
  /* 创建派工单 */
  'a:contract/createRequirement' ({commit}, params) {
    return ajax.api({
      cmd: 'box/sendWorkManager/createRequirement',
      parameters: params
    })
  },
  /* 获取派工地址- 省 */
  'a:contract/getAreaId01' ({commit}, params) {
    return ajax.api({
      cmd: 'box/sendWorkManager/getAreaId',
      parameters: params
    })
  },
  /* 获取派工地址 -市 */
  'a:contract/getAreaId02' ({commit}, params) {
    return ajax.api({
      cmd: 'box/sendWorkManager/getAreaId',
      parameters: params
    })
  },
  /* 获取派工地址-县 */
  'a:contract/getAreaId03' ({commit}, params) {
    return ajax.api({
      cmd: 'box/sendWorkManager/getAreaId',
      parameters: params
    })
  },
  /* 验收查看 */
  'a:contract/selectAcceptanceNum' ({commit}, params) {
    return ajax.api({
      cmd: 'box/sendWorkManager/selectAcceptanceNum',
      parameters: params
    })
  },
  /* 验收查看--修改 */
  'a:contract/updateAcceptanceNum' ({commit}, params) {
    return ajax.api({
      cmd: 'box/sendWorkManager/updateAcceptanceNum',
      parameters: params
    })
  },
  /* 关联历史 */
  'a:contract/getRList' ({commit}, params) {
    return ajax.api({
      cmd: 'box/contractMachineManager/getRList',
      ...params
    })
  },
  /* 设置完成 */
  'a:contract/updataOrderStatus' ({commit}, params) {
    return ajax.api({
      cmd: 'box/sendWorkManager/updataOrderStatus',
      parameters: params
    })
  }
}

export default {
  actions
}
