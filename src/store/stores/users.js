/* 运维管理接口 */
import ajax from '@/utils/ajax'

const actions = {
  /*  获取用户列表 */
  'a:users/findUserInfoList' ({commit}, params) {
    return ajax.api({
      cmd: 'box/sysUser/findUserInfoList',
      ...params
    })
  },
  /*  新建用户 */
  'a:users/saveUserRoleOrgGroup' ({commit}, params) {
    return ajax.api({
      cmd: 'box/sysUser/saveUserRoleOrgGroup',
      parameters: params
    })
  },
  /*  删除用户 */
  'a:users/deleteAccount' ({commit}, params) {
    return ajax.api({
      cmd: 'box/sysUser/deleteAccount',
      parameters: params
    })
  },
  /*  修改用户 */
  'a:users/updateUserRoleOrgGroup' ({commit}, params) {
    return ajax.api({
      cmd: 'box/sysUser/updateUserRoleOrgGroup',
      parameters: params
    })
  },
  /*  重置密码 */
  'a:users/retrievePassword' ({commit}, params) {
    return ajax.api({
      cmd: 'box/sysUser/retrievePassword',
      parameters: params
    })
  },
  /*  获取群组--无分页 */
  'a:users/getAllGroups' ({commit}, params) {
    return ajax.api({
      cmd: 'box/orgGroup/getAllGroups',
      parameters: params
    })
  },
  /*  新建群组 */
  'a:users/saveGroup' ({commit}, params) {
    return ajax.api({
      cmd: 'box/orgGroup/saveGroup',
      parameters: params
    })
  },
  /*  修改群组 */
  'a:users/updateGroup' ({commit}, params) {
    return ajax.api({
      cmd: 'box/orgGroup/updateGroup',
      parameters: params
    })
  },
  /*  删除群组 */
  'a:users/deleteGroup' ({commit}, params) {
    return ajax.api({
      cmd: 'box/orgGroup/deleteGroup',
      parameters: params
    })
  },
  /*  群组列表 */
  'a:users/getGroupList' ({commit}, params) {
    return ajax.api({
      cmd: 'box/orgGroup/getGroupList',
      ...params
    })
  },
  /*  角色列表 */
  'a:users/findRoleList' ({commit}, params) {
    return ajax.api({
      cmd: 'box/role/findRoleList',
      ...params
    })
  },
  /*  角色权限 */
  'a:users/getRolePages' ({commit}, params) {
    return ajax.api({
      cmd: 'box/role/getRolePages',
      parameters: params
    })
  },
  /*  获取所有菜单 */
  'a:users/findModules' ({commit}, params) {
    return ajax.api({
      cmd: 'box/module/findModules',
      parameters: params
    })
  },
  /*  新建角色 */
  'a:users/saveRole' ({commit}, params) {
    return ajax.api({
      cmd: 'box/role/saveRole',
      parameters: params
    })
  },
  /*  删除角色 */
  'a:users/deleteRole1' ({commit}, params) {
    return ajax.api({
      cmd: 'box/role/deleteRole',
      parameters: params
    })
  },
  /*  修改角色 */
  'a:users/updateRole1' ({commit}, params) {
    return ajax.api({
      cmd: 'box/role/updateRole',
      parameters: params
    })
  },
  /*  角色下拉列表 */
  'a:users/findAllRole' ({commit}, params) {
    return ajax.api({
      cmd: 'box/role/findAllRole',
      parameters: params
    })
  }
}

export default {
  actions
}
