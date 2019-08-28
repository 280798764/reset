/* 常用过滤 */
const filters = {
  // 设备管理-start
  // 联网状态
  isOnline (isOnline) {
    switch (isOnline) {
      case '0':
        return '离线'
      case '1':
        return '在线'
      default:
        return ''
    }
  },
  // 是否在线
  onlineIs (onlineIs) {
    switch (onlineIs) {
      case '0':
        return '否'
      case '1':
        return '是'
      default:
        return ''
    }
  },
  // 申请来源
  applySourceId (applySourceId) {
    switch (applySourceId) {
      case 1:
        return '优尼斯金融'
      case 2:
        return '优尼斯3C'
      case 3:
        return '优尼斯工业'
      case 4:
        return '云科自有'
      case 5:
        return '研究院'
      case 6:
        return '其他'
      default:
        return ''
    }
  },
  // 状态
  operation (operation) {
    switch (operation) {
      case 1:
        return '立即开通'
      case 2:
        return '稍后开通'
      case 3:
        return '冻结'
      default:
        return ''
    }
  },
  // 获取方式
  useType (useType) {
    switch (useType) {
      case '1':
        return '自有'
      case '2':
        return '租赁'
      default:
        return ''
    }
  },
  // 派工服务类型
  deliveryServiceType (sendType) {
    switch (sendType) {
      case '0':
        return '实施'
      case '1':
        return '回收'
      case '2':
        return '更换'
      default:
        return ''
    }
  },
  // 派工状态
  dispatchingStatus (dispatching) {
    switch (dispatching) {
      case '10':
        return '派工中'
      case '20':
        return '取消'
      case '30':
        return '完成'
      default:
        return ''
    }
  },
  // // 设备管理-end
  // 运营管理-start
  // sim卡状态
  cardStatus (status) {
    switch (status) {
      case '1':
        return '可激活'
      case '2':
        return '测试激活'
      case '3':
        return '测试去激活'
      case '4':
        return '在用'
      case '5':
        return '停机'
      case '6':
        return '运营商管理状态'
      case '7':
        return '拆机'
      default:
        return ''
    }
  },
  // sim断网状态
  cutStatus (status) {
    switch (status) {
      case '0':
        return '断网'
      case '1':
        return '未断网'
      default:
        return ''
    }
  }
  // 运营管理-end
}

export default filters
