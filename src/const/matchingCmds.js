/* 模糊匹配的cmd */
/* 只匹配id type: 1 ({id, name}键值对) */
const matchingIdCmds = [
  {
    id: 1, // 客户名称
    max: 20, // 最大长度
    cmd: 'a:device/selectFactory'
  },
  {
    id: 2, // 工程师名称
    cmd: 'a:matching/userNameList'
  },
  {
    id: 3, // 物料编号
    cmd: 'a:common/getMaterialId'
  },
  {
    id: 4, //  申请单号
    cmd: 'a:matching/applySn'
  },
  {
    id: 5, //  发货单号
    cmd: 'a:shipping/getShippingSn'
  },
  {
    id: 6, //  出库类别
    cmd: 'a:common/stockOutTypeList'
  }
]

/* 只匹配名称 type: 2 (name拼接串) */
const matchingNameCmds = [
  {
    id: 1, // 备件名称
    cmd: 'a:matching/partName'
  },
  {
    id: 2, // 备件型号
    cmd: 'a:matching/partModel'
  },
  {
    id: 3, // 备件序列号
    cmd: 'a:matching/partSn'
  },
  {
    id: 4, // 派工单号
    cmd: 'a:matching/findDispatchSn'
  },
  {
    id: 5, // 备件名称（库存中的）
    cmd: 'a:common/inventory/getPartName'
  },
  {
    id: 6, // 备件序列号 （库存中的）
    cmd: 'a:common/inventoryDetail/getPartSn'
  },
  {
    id: 7, // 整机型号
    cmd: 'a:matching/getWebPartModel'
  }
]

/* 只是提示，可以输入列表之外的数据 type: 3 */
const matchingInputCmds = [
  {
    id: 1, // 备件序列号
    cmd: 'a:matching/partSn'
  },
  {
    id: 2, // 工程师名称
    cmd: 'a:matching/userNameList'
  },
  {
    id: 3, // 备件序列号
    cmd: 'a:matching/partSn'
  },
  {
    id: 4, // 整机型号
    cmd: 'a:matching/getWebPartModel'
  },
  {
    id: 5, // 整机序列号
    cmd: 'a:matching/getCompleteMachineSn'
  },
  {
    id: 6, // 出库单备件序列号模糊查询(商务单模块备件详情弹窗块使用)
    cmd: 'a:matching/getStockPartSnList'
  }
]

export default {
  matchingNameCmds,
  matchingIdCmds,
  matchingInputCmds
}
