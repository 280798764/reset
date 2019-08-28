import tool from '@/utils/tool'
import filters from '@/utils/filters'

export default {
  data () {
    return {
      firstLabelWid: '65px', // 第一列的标签宽度
      clientInputWid: '350px' // 客户名称的宽度
    }
  },
  computed: {
    // 参数列表集合
    enumParams () { return tool.getEnumParams() },
    // 网上状态
    netState () { return this.enumParams.netState },
    // 在线状态
    isOnlineList () { return this.enumParams.isOnlineList },
    // 获取方式
    getWay () { return this.enumParams.getWay },
    // 月份列表
    monthList () { return this.enumParams.monthList }
  },
  filters: {
    // 联网状态
    isOnline: filters.isOnline,
    // 是否在线
    onlineIs: filters.onlineIs,
    // 获取方式
    useType: filters.useType,
    // 获取申请来源
    applySourceId: filters.applySourceId,
    // 状态
    operation: filters.operation,
    // 派工服务类型
    deliveryServiceType: filters.deliveryServiceType,
    // 派工状态
    dispatchingStatus: filters.dispatchingStatus,
    // sim卡状态
    cardStatus: filters.cardStatus,
    // sim断网状态
    cutStatus: filters.cutStatus
  }
}
