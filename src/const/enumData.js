/* 数组字典 */
const params = {
  /* 联网状态 */
  netState: [
    { id: '1', name: '在线' },
    { id: '0', name: '离线' }
  ],
  /* 是否在线 */
  isOnlineList: [
    { id: '1', name: '是' },
    { id: '0', name: '否' }
  ],
  /* 获取方式 */
  getWay: [
    { id: 1, name: '自有' },
    { id: 2, name: '租赁' }
  ],
  /* 月份列表 */
  monthList: [
    {name: '一月', id: new Date().getFullYear() + '-' + '01'},
    {name: '二月', id: new Date().getFullYear() + '-' + '02'},
    {name: '三月', id: new Date().getFullYear() + '-' + '03'},
    {name: '四月', id: new Date().getFullYear() + '-' + '04'},
    {name: '五月', id: new Date().getFullYear() + '-' + '05'},
    {name: '六月', id: new Date().getFullYear() + '-' + '06'},
    {name: '七月', id: new Date().getFullYear() + '-' + '07'},
    {name: '八月', id: new Date().getFullYear() + '-' + '08'},
    {name: '九月', id: new Date().getFullYear() + '-' + '09'},
    {name: '十月', id: new Date().getFullYear() + '-' + '10'},
    {name: '十一月', id: new Date().getFullYear() + '-' + '11'},
    {name: '十二月', id: new Date().getFullYear() + '-' + '12'}
  ]
}
export default params
