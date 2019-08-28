<!--登录页面-->
<template>
  <section class="loginInfo">
    <div class="header">
      <div class="logo"><img src="~@/assets/images/header-Logo.png" alt=""></div>
      <div class="title"><span></span>机床数据采集后台</div>
    </div>
    <!--<div class="bg"></div>-->
    <div class="content-wraper">
      <div class="content">
        <div class="content-header">
          <img src="~@/assets/images/header-Logo-top.png">
          <span>机床数据采集后台</span>
        </div>
        <div class="line-bottom"></div>
        <div class="content-top">
        </div>
        <div class="content-info" @keyup.enter="login">
          <ul>
            <li>
              <i class="pre-icon icon-phone"></i>
              <input name="username" type="text" v-model.trim="paramsLogin.account" class="long-text" placeholder="请输入用户名">
            </li>
            <li>
              <i class="pre-icon icon-pwd"></i>
              <input name="password" type="password" v-model.trim="paramsLogin.password" class="long-text" placeholder="请输入密码">
            </li>
            <li>
              <i class="pre-icon icon-code"></i>
              <input class="text" type="text" v-model.trim="paramsLogin.verifyValue" spellcheck="false" placeholder="请输入图片验证码" maxlength="6">
              <div class="verify-code" @click="getVerifyImage">
                <img :src="verifyImageSrc" alt="">
              </div>
            </li>
          </ul>
        </div>
        <div class="radio" @click="saveUser">
          <Radio label="apple" v-model="checked">
            <span>记住用户名？</span>
          </Radio>
        </div>
        <div class="operate-btns">
          <div class="btn-yellow" @click="login(paramsLogin.mobile)">登录<span class="login-right"></span></div>
        </div>
      </div>
    </div>
   <!-- <footer class="copyright-wrapper">
     &lt;!&ndash; <div>
        <span>Copyright©{{endYear}} 智能云科信息科技有限公司 All Rights Reserved. 沪ICP备15045455号-1</span>
      </div>&ndash;&gt;
    </footer>-->
  </section>
</template>

<script>
export default {
  data () {
    return {
      endYear: new Date().getFullYear(),
      checked: false, // radio
      verifyImageSrc: '',
      errorInfo: '', // 错误信息提示
      verifyImg: '',
      params: {
        verifyKey: ''
      },
      paramsLogin: {
        account: '', // 登录名
        password: '', // 密码
        verifyKey: '', // 验证码
        verifyValue: '' // 验证码
      },
      menuParams: {
        appId: 'ibox_admin',
        language: 'zh_CN',
        userId: ''
      },
      routerList: []
    }
  },
  mounted () {
    // 读取本地的用户名
    this.getLocal()
    this.getVerifyImage()
  },
  methods: {
    saveUser () {
      this.checked = !this.checked
    },
    // 读取本地的用户名
    getLocal () {
      this.paramsLogin.account = localStorage.getItem('userName')
      this.checked = Boolean(localStorage.getItem('checked'))
    },
    // 设置本地的用户名
    setLocal () {
      localStorage.setItem('userName', this.paramsLogin.account)
    },
    // 验证手机号码格式
    isMobilePhone (mobile) {
      return mobile && /(^13\d{9}$)|(^14)[5,7,9]\d{8}$|(^15[0,1,2,3,5,6,7,8,9]\d{8}$)|(^17)[0,1,3,5,6,7,8]\d{8}$|(^19)[0,1,3,5,6,7,8]\d{8}$|(^18\d{9}$)/.test(mobile)
    },
    // 初始化验证码
    init () {
      this.getVerifyImage()
    },
    // 清除本地的用户名
    clearLocal () {
      localStorage.setItem('userName', '')
      localStorage.setItem('checked', '')
    },
    getVerifyImage () {
      // 获取验证码(调接口)
      this.$store.dispatch('a:login/getVerifyImage', this.params).then(
        res => {
          this.paramsLogin.verifyKey = res.verifyKey
          this.verifyImageSrc = 'data:image/jpg;base64,' + res.img
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    // 获取菜单
    getMenu (userToken) {
      this.$store.dispatch('a:login/getMenus', {
        appId: 'imeconfig',
        language: 'zh_CN',
        userId: ''
      }).then(
        res => {
          this.routerList = res || []
          console.log(res, 'res==')
          if (this.routerList.length) {
            this.$Message.success('登录成功！')
            console.log(this.routerList, 'this.routerList')
            this.$router.push('/device/index')
          } else {
            this.alert('无权限登录', 'error')
            this.$router.push('/index')
          }
          // sessionStorage.setItem('userToken', res.token)
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    // 登录
    login (userName) {
      sessionStorage.setItem('userToken', '')
      // 判断复选框是否被勾选
      if (this.checked === true) {
        localStorage.setItem('checked', true)
        // 传入账号名和保存天数2个参数
        this.setLocal(userName, 7)
      } else {
        // 清空Local
        this.clearLocal()
      }
      // 非空字段验证
      if (!this.paramsLogin.account) {
        this.errorInfo = '请输入用户!'
        this.alert(this.errorInfo, 'error')
      } else if (!this.paramsLogin.password) {
        this.errorInfo = '请输入密码!'
        this.alert(this.errorInfo, 'error')
      } else if (!this.paramsLogin.verifyValue) {
        this.errorInfo = '请输入验证码!'
        this.alert(this.errorInfo, 'error')
      } else {
        this.$store.dispatch('a:login/login', this.paramsLogin).then(
          res => {
            sessionStorage.setItem('userToken', res.token)
            sessionStorage.setItem('name', res.memberName)
            this.getMenu(res.token)
          },
          rej => {
            this.alert(rej.errorInfo, 'error')
            this.getVerifyImage()
            this.paramsLogin.verifyValue = ''
          }
        )
      }
    }
  }
}
</script>

<style lang="less" scoped>
  /*@import '~@/assets/styles/modules/login.less';*/
  @import '~@/assets/styles/modules/login.less';
</style>
