/* 设备管理 */
import layout from '@/components/layout/Index'

// 页面备注
const group = resolve => require(['@/components/pages/users/Group'], resolve)
const personnel = resolve => require(['@/components/pages/users/Personnel'], resolve)
const role = resolve => require(['@/components/pages/users/Role'], resolve)

const routes = [
  {
    path: '/users',
    component: layout,
    children: [
      {
        path: 'Group',
        component: group
      },
      {
        path: 'Personnel',
        component: personnel
      },
      {
        path: 'Role',
        component: role
      }
    ]
  }
]

export default routes
