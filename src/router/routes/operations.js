/* 设备管理 */
import layout from '@/components/layout/Index'

// 页面备注
const deviceIndex = resolve => require(['@/components/pages/device/Index'], resolve)
const vpnList = resolve => require(['@/components/pages/operations/VpnList'], resolve)
const SIMcard = resolve => require(['@/components/pages/operations/SIMcard'], resolve)
const simDetail = resolve => require(['@/components/pages/operations/SimDetail'], resolve)
const factoryList = resolve => require(['@/components/pages/operations/FactoryList'], resolve)
const regUser = resolve => require(['@/components/pages/operations/RegUser'], resolve)
const engineerList = resolve => require(['@/components/pages/operations/EngineerList'], resolve)
const getUser = resolve => require(['@/components/pages/operations/GetUser'], resolve)
const update = resolve => require(['@/components/pages/operations/Update'], resolve)
const flow = resolve => require(['@/components/pages/operations/Flow'], resolve)
const warn = resolve => require(['@/components/pages/operations/Warn'], resolve)
const routes = [
  {
    path: '/operations',
    component: layout,
    children: [
      {
        path: 'Index',
        component: deviceIndex
      },
      {
        path: 'FactoryList',
        component: factoryList
      },
      {
        path: 'EngineerList',
        component: engineerList
      },
      {
        path: 'RegUser',
        component: regUser
      },
      {
        path: 'FactoryList',
        component: factoryList
      },
      {
        path: 'GetUser',
        component: getUser
      },
      {
        path: 'Update',
        component: update
      },
      {
        path: 'VpnList',
        component: vpnList
      },
      {
        path: 'SimDetail',
        component: simDetail
      },
      {
        path: 'SIMcard',
        component: SIMcard
      },
      {
        path: 'Flow',
        component: flow
      },
      {
        path: 'Warn',
        component: warn
      }
    ]
  }
]

export default routes
