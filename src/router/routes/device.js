/* 设备管理 */
import layout from '@/components/layout/Index'

// 页面备注
const deviceIndex = resolve => require(['@/components/pages/device/Index'], resolve)

const routes = [
  {
    path: '/device',
    component: layout,
    children: [
      {
        path: 'Index',
        component: deviceIndex
      }
    ]
  }
]

export default routes
