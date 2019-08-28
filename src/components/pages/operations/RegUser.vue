<template>
  <section>
    <div class="page-title-wrapper" >
      <span class="icon-title"></span>
      <span>创建账号</span>
    </div>
    <div class="filter">
      <div class="filter-title">
        手机号码
        <span class="require">*</span>
      </div>
      <input type="text" class="imdata-input filter-input" v-model="params.mobileNo"/>
      <span class="require" v-if="!isOld">---&nbsp;手机号码格式：11位数字以1开头!&nbsp;---</span>
      <span class="require" v-else>---&nbsp;该号码是会员中心已有用户，可直接保存后在已有帐号中创建iBox工厂主帐号&nbsp;---</span>
    </div>
    <div class="filter" v-if="!isOld">
      <div class="filter-title">
        姓名
        <span class="require">*</span>
      </div>
      <input type="text" class="imdata-input filter-input" v-model.trim="params.fullName"/>
    </div>
    <div class="filter" v-if="!isOld">
      <div class="filter-title">
        初始密码
        <span class="require">*</span>
      </div>
      <input type="text" class="imdata-input filter-input" v-model="params.password"/><span class="require">---&nbsp;密码必须由6-12位数字加字母组成!&nbsp;---</span>
    </div>
    <div class="filter" v-if="!isOld">
      <div class="filter-title">
        会员性别
        <span class="require">*</span>
        <RadioGroup v-model="params.gender" style="height: 30px;line-height: 25px;margin-left: 15px">
          <Radio label="男"></Radio>
          <Radio label="女"></Radio>
        </RadioGroup>
      </div>
    </div>
    <div class="filter" v-if="!isOld">
      <div class="filter-title">
        邮箱
        <span class="require">*</span>
      </div>
      <input type="text" class="imdata-input filter-input" v-model="params.email"/><span class="require">---&nbsp;请输入正确格式的邮箱(例如: test@qq.com.cn)!&nbsp;---</span>
    </div>
    <!-- 底部功能按钮 -->
    <section class="btns-group">
      <div class="btn btn-gray" @click="backForward">返回</div>
      <div class="btn btn-blue" @click="registerUser">保存</div>
    </section>
  </section>
</template>

<script>
import tool from '@/utils/tool'
export default {
  data () {
    return {
      inType: '', // 判断是哪个页面进入此页面
      params: {// 创建账户参数
        mobileNo: '',
        fullName: '',
        gender: '',
        email: ''
      },
      isOld: false // 是否会员中心老账户
    }
  },
  mounted () {
    this.inType = sessionStorage.getItem('inType')
  },
  methods: {
    // 返回
    backForward () {
      if (this.inType === '1') {
        this.$router.push('/operations/FactoryList')
      } else {
        this.$router.push('/operations/EngineerList')
      }
    },
    // 创建用户
    registerUser () {
      if (!this.isOld) { // 新用户注册
        if (!this.params.mobileNo) {
          this.alert('手机号码不能为空!')
        } else if (!tool.isMobilePhone(this.params.mobileNo)) {
          // this.alert('手机号码格式：11位数字以1开头!')
          this.alert('请输入正确的手机号码格式')
        } else if (!this.params.fullName) {
          this.alert('姓名不能为空!')
        } else if (!this.params.password) {
          this.alert('初始密码不能为空!')
        } else if (!tool.pwdReg(this.params.password)) {
          this.alert('密码必须由6-12位数字加字母组成!')
        } else if (!this.params.gender) {
          this.alert('请输入性别!')
        } else if (!this.params.email) {
          this.alert('邮箱不能为空!')
        } else if (!tool.isEmail(this.params.email)) {
          this.alert('邮箱格式不正确!')
        } else {
          this.$store.dispatch('a:device/registerUser', this.params).then(
            res => {
              this.$Modal.info({
                title: '提示',
                content: '创建成功!',
                onOk: () => {
                  this.$router.push('/operations/GetUser')
                }
              })
            },
            rej => {
              this.alert(rej.errorInfo, 'error')
            }
          )
        }
      } else { // 老用户注册
        // 直接跳转到已有帐号查询页
        this.$router.push('/operations/GetUser')
      }
    },
    // 是否会员中心已有用户
    checkOld () {
      if (this.params.mobileNo) {
        this.$store.dispatch('a:device/isOldAccount', this.params.mobileNo).then(
          res => {
            if (res) {
              // 是老账号
              this.isOld = true
            } else {
              this.isOld = false
            }
          },
          rej => {
            this.isOld = false // window.alert('会员中心老账号校验失败，原因：' + rej)
          })
      }
    }
  }
}
</script>

<style lang="less" scoped>
  @import '../../../assets/styles/pages/device/general.less';
  .control div {margin-left: 95px;}
  .control {
    display: flex;
  }
  .filter, .btns-group {
    background-color: #fff;
  }
</style>
