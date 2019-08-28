<!-- 应用上架还是下架 -->
<template>
  <section class="dialog-wrapper">
    <div class="dialog">
      <div class="dialog-header">
        <span v-if="dlgInfo.type === 'create'">新建账号</span>
        <span v-if="dlgInfo.type === 'edit'">修改账号</span>
        <span v-if="dlgInfo.type === 'reset'">重置密码</span>
        <span v-if="dlgInfo.type === 'delete'">删除用户</span>
        <span class="dlg-close"><i class="iconfont close" @click="cancel"></i></span>
      </div>
      <div class="dialog-body">
        <div v-if="dlgInfo.type === 'create' || dlgInfo.type === 'edit'">
          <div class="line">
            <label class="required">群组：</label>
            <div class="select-wrapper">
              <Select v-model="addParams.groupId" clearable>
                <Option v-for="item in groups" :value="item.id" :key="item.id">{{item.groupName}}</Option>
              </Select>
            </div>
          </div>
          <div class="line">
            <label class="required">角色：</label>
            <div class="select-wrapper">
              <Select v-model="addParams.roleId" clearable>
                <Option v-for="item in roles" :value="item.roleid" :key="item.roleid">{{item.roleName}}</Option>
              </Select>
            </div>
          </div>
          <div class="line" v-if="dlgInfo.type === 'create'">
            <label class="required">用户名：</label>
            <input type="text" v-model.trim="addParams.memberName" placeholder="请输入用户名">
          </div>
          <div class="line" v-if="dlgInfo.type === 'edit'">
            <label class="required">用户名：</label>
            <input type="text" v-model.trim="addParams.memberName" readonly>
          </div>
          <div class="line">
            <label class="required">姓名：</label>
            <input type="text" v-model.trim="addParams.fullName" placeholder="请输入姓名">
          </div>
          <div class="line" v-if="dlgInfo.type === 'create'">
            <label class="required">密码：</label>
            <input type="password" v-model.trim="addParams.password" placeholder="请输入密码">
          </div>
          <div class="line">
            <label class="required">手机号：</label>
            <input type="text" v-model.trim="addParams.telephone" placeholder="请输入手机号">
          </div>
          <div class="line">
            <label class="required">邮箱：</label>
            <input type="text" v-model.trim="addParams.email" placeholder="请输入邮箱">
          </div>
        </div>
        <div v-if="dlgInfo.type === 'reset'">
          <div class="line">
            <label class="required">密码：</label>
            <input type="text" v-model.trim="resetParams.newPassword" placeholder="请输入密码!">
          </div>
          <div class="text">
            密码需设置至少为6位，包含数字、字母及特殊字符中至少两种
          </div>
        </div>
        <div v-if="dlgInfo.type === 'delete'">
          <div class="line-text">确认删除当前用户账号？</div>
        </div>
      </div>
      <div class="dialog-footer">
        <div class="btn btn-cancel wid-70px mr-15px" @click="cancel">取消</div>
        <div class="btn btn-sure wid-70px mr-15px" v-if="dlgInfo.type !== 'delete'" @click="save">保存</div>
        <div class="btn btn-sure wid-70px mr-15px" v-if="dlgInfo.type === 'delete'" @click="deleteItem">删除</div>
      </div>
    </div>
  </section>
</template>

<script>
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'

export default {
  mixins: [mixinsTable, mixinsInfo],
  data () {
    return {
      roles: [], // 角色下拉数据
      groups: [], // 群组下拉数据
      addParams: {
        email: '',
        fullName: '', // 姓名
        groupId: '', // 群组id
        memberName: '', // 用户名
        password: '', // 密码
        roleId: '', // 角色id
        telephone: '' // 电话
      },
      resetParams: { // 重置参数
        // memberName: '',
        memberCode: '',
        newPassword: ''
      },
      deleteParams: {
        memberName: '', //  用户登录名
        memberCode: ''// 用户code
      },
      errorInfo: ''
    }
  },
  props: ['dlgInfo', 'search', 'memberCode', 'itemObject', 'itemDelete'],
  mounted () {
    if (this.dlgInfo.type === 'edit') {
      this.addParams.email = this.itemObject.email
      this.addParams.fullName = this.itemObject.name
      this.addParams.groupId = this.itemObject.groupId
      this.addParams.memberName = this.itemObject.memberName
      this.addParams.roleId = this.itemObject.roleId
      this.addParams.telephone = this.itemObject.phone
      this.addParams.memberCode = this.itemObject.memberCode
    }
    this.resetParams.memberCode = sessionStorage.getItem('memberCode')
    this.deleteParams.memberName = this.itemDelete.memberName
    this.deleteParams.memberCode = this.itemDelete.memberCode
    // 获取下拉角色
    this.$store.dispatch('a:users/findAllRole', {name: ''}).then(
      res => {
        this.roles = res || []
      },
      rej => {
        this.alert(rej.errorInfo, 'error')
      }
    )
    // 获取下拉群组
    this.$store.dispatch('a:users/getAllGroups', {name: ''}).then(
      res => {
        this.groups = res || []
      },
      rej => {
        this.alert(rej.errorInfo, 'error')
      }
    )
  },
  methods: {
    // 取消
    cancel () {
      this.$emit('cancel')
    },
    // 保存
    save () {
      if (this.addParams.telephone) {
        if (this.dlgInfo.type === 'create' || this.dlgInfo.type === 'edit') {
          // 匹配手机号码
          let isPhone = this.isMobilePhone(this.addParams.telephone)
          if (!isPhone) {
            this.errorInfo = '请输正确的手机号码'
            this.alert(this.errorInfo, 'error')
            return
          }
        }
      }
      if (this.addParams.email) {
        if (this.dlgInfo.type === 'create' || this.dlgInfo.type === 'edit') {
          //  匹配邮箱
          let isEmial = this.isEmail(this.addParams.email)
          if (!isEmial) {
            this.errorInfo = '请输正确的邮箱'
            this.alert(this.errorInfo, 'error')
            return
          }
        }
      }
      if (this.dlgInfo.type === 'create' || this.dlgInfo.type === 'edit') {
        if (!this.addParams.groupId) {
          this.errorInfo = '请输入群组！'
          this.alert(this.errorInfo, 'error')
          return
        } else if (!this.addParams.roleId) {
          this.errorInfo = '请输入角色！'
          this.alert(this.errorInfo, 'error')
          return
        } else if (!this.addParams.memberName) {
          this.errorInfo = '请输入用户名！'
          this.alert(this.errorInfo, 'error')
          return
        } else if (!this.addParams.fullName) {
          this.errorInfo = '请输入姓名！'
          this.alert(this.errorInfo, 'error')
          return
        } else if (!this.addParams.telephone) {
          this.errorInfo = '请输入手机号码！'
          this.alert(this.errorInfo, 'error')
          return
        } else if (!this.addParams.email) {
          this.errorInfo = '请输入邮箱！'
          this.alert(this.errorInfo, 'error')
          return
        }
      }
      if (this.dlgInfo.type === 'create') { // 新建
        if (!this.addParams.password) {
          this.errorInfo = '请输入密码！'
          this.alert(this.errorInfo, 'error')
          return
        }
        this.$store.dispatch('a:users/saveUserRoleOrgGroup', this.addParams).then(
          res => {
            this.$Modal.info({
              title: '提示',
              content: '新建用户信息成功！',
              onOk: () => {
                this.dlgInfo.showDlg = false
                this.search()
              }
            })
          },
          rej => {
            this.alert(rej.errorInfo, 'error')
          }
        )
      } else if (this.dlgInfo.type === 'edit') { // 修改
        this.$store.dispatch('a:users/updateUserRoleOrgGroup', this.addParams).then(
          res => {
            this.$Modal.info({
              title: '提示',
              content: '修改用户信息成功！',
              onOk: () => {
                this.dlgInfo.showDlg = false
                this.search()
              }
            })
          },
          rej => {
            this.alert(rej.errorInfo, 'error')
          }
        )
      } else if (this.dlgInfo.type === 'reset') { // 重新设置密码
        if (this.dlgInfo.type === 'reset') {
          if (!this.resetParams.newPassword) {
            this.errorInfo = '请输入重置的密码！'
            this.alert(this.errorInfo, 'error')
            return
          }
        }
        this.$store.dispatch('a:users/retrievePassword', this.resetParams).then(
          res => {
            this.$Modal.info({
              title: '提示',
              content: '重置密码成功！',
              onOk: () => {
                this.dlgInfo.showDlg = false
                this.search()
              }
            })
          },
          rej => {
            this.alert(rej.errorInfo, 'error')
          }
        )
      }
    },
    // 删除
    deleteItem () {
      this.$store.dispatch('a:users/deleteAccount', this.deleteParams).then(
        res => {
          this.$Modal.info({
            title: '提示',
            content: '删除用户成功！',
            onOk: () => {
              this.dlgInfo.showDlg = false
              this.search()
            }
          })
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
.dialog {
  width: 550px;
}
.dialog-body .line > input {
  width: 250px;
}
.select-wrapper {
  width: 250px !important;
}
.line div {
  margin: 0 !important;
}
.line {
  div {
    margin: auto;
  }
}
.reminder {
  margin-left: 10px;
  color: red;
}
.line-select {
  margin-bottom: 70px;
}
.text {
  width: 100%;
  text-align: center;
  color: darkgray;
}
.line-text {
 height: 100px;
  line-height: 100px;
  text-align: center;
}
</style>
