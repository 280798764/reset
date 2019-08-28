import layout from '@/components/layout/Index'

const index = resolve => require(['@/components/pages/homepage/Index'], resolve)

const routes = [
  {
    path: '/index1',
    component: layout,
    children: [
      {
        path: '',
        component: index
      }
    ]
  }
]

export default routes
