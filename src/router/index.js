import Vue from 'vue'
import Router from 'vue-router'
import iview from 'iview'
import login from './routes/login'
import homepage from './routes/homepage'
import demoPageOne from './routes/demoPageOne'
import device from './routes/device'
import operations from './routes/operations'
import users from './routes/users'
import contract from './routes/contract'

Vue.use(Router)

const router = new Router({
  routes: [
    ...login,
    ...homepage,
    ...demoPageOne,
    ...device,
    ...operations,
    ...users,
    ...contract,
    {
      path: '/*',
      redirect: to => {
        return '/index'
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  // 页面调整 去除iview 提示信息
  iview.Notice.destroy()
  next()
})

export default router
