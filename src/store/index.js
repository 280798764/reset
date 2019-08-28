/* Vuex Store */
import Vue from 'vue'
import Vuex from 'vuex'

import common from './stores/common'
import file from './stores/file'
import homepage from './stores/homepage'
import demoPageOne from './stores/demoPageOne'
import device from './stores/device'
import login from './stores/login'
import operations from './stores/operations'
import users from './stores/users'
import contract from './stores/contract'
import efficiency from './stores/efficiency'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    common,
    file,
    homepage,
    demoPageOne,
    device,
    login,
    operations,
    users,
    contract,
    efficiency
  }
})
