<!-- 应用上架还是下架 -->
<template>
  <section class="dialog-wrapper">
    <div class="dialog">
      <div class="dialog-header">
        <span>重置密码</span>
        <span class="dlg-close"><i class="iconfont close" @click="cancel"></i></span>
      </div>
      <div class="dialog-body">
        <div>
          <div class="line">
            <label class="required">密码：</label>
            <input type="text" v-model.trim="resetParams.newPassword" placeholder="请输入密码！">
          </div>
          <div class="text">
            密码需设置至少为6位，包含数字、字母及特殊字符中至少两种
          </div>
        </div>
      </div>
      <div class="dialog-footer">
        <div class="btn btn-cancel wid-70px mr-15px" @click="cancel">取消</div>
        <div class="btn btn-sure wid-70px mr-15px" @click="save">保存</div>
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
      resetParams: {
        memberName: '',
        newPassword: ''
      }
    }
  },
  props: ['dlgInfo'],
  methods: {
    // 取消
    cancel () {
      this.$emit('cancel')
    },
    save () {
      if (!this.resetParams.newPassword) {
        this.errorInfo = '请输入重置的密码！'
        this.alert(this.errorInfo, 'error')
        return
      }
      this.resetParams.memberName = sessionStorage.getItem('name')
      this.$store.dispatch('a:operations/retrievePassword', this.resetParams).then(
        res => {
          this.$Modal.info({
            title: '提示',
            content: '重置密码成功！',
            onOk: () => {
              this.dlgInfo.showDlg = false
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
