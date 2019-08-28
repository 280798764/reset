<template>
  <section class="header-wrapper">
    <div class="header">
      <div class="left">
        <i class="iconfont icon-diagnose-logo"></i>
        <span>机床数据采集后台</span>
      </div>
      <div class="right">
        <span class="before" v-if="userName">欢迎你，</span>
        <span class="username">{{userName || '未登录'}}
        </span>
        <span class="usericon"><img src="~@/assets/images/usericon.png" alt=""></span>
        <div class="oncall">
          <!--<i @click="resetPassword">修改密码</i>-->
          <i @click="logout">退出</i>
        </div>
      </div>
    </div>
    <dialog-SetPassword v-if="dlgInfo.showDlg" :dlgInfo="dlgInfo" @cancel="dlgInfo.showDlg = false"></dialog-SetPassword>
  </section>
</template>
<script>
import DialogSetPassword from './DialogsetPassword.vue'
import { DOMAIN } from '@/utils/config'

export default {
  data () {
    return {
      userName: '',
      dlgInfo: {
        showDlg: false
      },
      resetParams: {
        memberName: '',
        newPassword: ''
      }
    }
  },
  components: {
    DialogSetPassword
  },
  created () {
    this.userName = sessionStorage.getItem('name') || '未登录'
    if (this.userName === '未登录') {
      location.replace(DOMAIN.origin)
    }
  },
  methods: {
    // 取消
    cancel () {
      this.$emit('cancel')
    },
    // 重置密码
    resetPassword () {
      this.dlgInfo.showDlg = true
    },
    // 登出
    logout () {
      sessionStorage.clear()
      // 判断是线上还是本地环境
      if (location.hostname === 'localhost') {
        location.replace('http://' + location.host)
      } else {
        location.replace(DOMAIN.origin)
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/modules/header.less";
</style>
