/* 设备管理 */
import layout from '@/components/layout/Index'

// 页面备注
const index = resolve => require(['@/components/pages/contract/Index'], resolve)
const detail = resolve => require(['@/components/pages/contract/Detail'], resolve)
const deviceDetail = resolve => require(['@/components/pages/contract/DeviceDetail'], resolve)

const routes = [
  {
    path: '/contract',
    component: layout,
    children: [
      {
        path: 'Index',
        component: index
      },
      {
        path: 'Detail',
        component: detail
      },
      {
        path: 'DeviceDetail',
        component: deviceDetail
      }
    ]
  }
]

export default routes
