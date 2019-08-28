/* 登陆页面 */
const Login = resolve => require(['@/components/pages/login/Index'], resolve)

const routes = [
  {
    path: '/index',
    component: Login
  }
]

export default routes
