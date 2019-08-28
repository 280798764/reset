/* 登录 */
import ajax from '@/utils/ajax'

const actions = {
  /* 01 登录 */
  'a:login/login' ({commit}, parameters) {
    return ajax.api({
      cmd: 'memberCenter/user/login',
      parameters
    })
  },
  /* 02 获取图片验证码 */
  'a:login/getVerifyImage' ({commit}, parameters) {
    return ajax.api({
      cmd: 'appshop_base/sysUser/getVerifyImage',
      parameters
    })
  },
  /* 02 获取菜单 */
  'a:login/getMenus' ({commit}, parameters, userToken) {
    return ajax.api({
      cmd: 'authority/menus/getMenus',
      parameters,
      userToken: sessionStorage.getItem('userToken')
    })
  }
}

export default {
  actions
}
