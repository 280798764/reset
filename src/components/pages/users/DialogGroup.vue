<!-- 应用上架还是下架 -->
<template>
  <section class="dialog-wrapper">
    <div class="dialog">
      <div class="dialog-header">
        <span v-if="dlgInfo.type === 'create'">新增群组</span>
        <span v-if="dlgInfo.type === 'edit'">修改群组</span>
        <span v-if="dlgInfo.type === 'delete'">删除群组</span>
        <span class="dlg-close"><i class="iconfont close" @click="cancel"></i></span>
      </div>
      <div class="dialog-body">
        <div v-if="dlgInfo.type !== 'delete'">
          <div class="line">
            <label class="required">群组名称：</label>
            <input type="text" v-model.trim="params.groupName" placeholder="请输入群组名称">
          </div>
        </div>
        <div v-if="dlgInfo.type === 'delete'">
          <div class="line">
            <div>确认删除当前群组？</div>
          </div>
        </div>
      </div>
      <div class="dialog-footer">
        <div class="btn btn-cancel wid-70px mr-15px" @click="cancel">取消</div>
        <div class="btn btn-sure wid-70px mr-15px" v-if="dlgInfo.type !== 'delete'" @click="save">保存</div>
        <div class="btn btn-sure wid-70px mr-15px" v-if="dlgInfo.type === 'delete'" @click="deleteConfirm">删除</div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: ['dlgInfo', 'params', 'search'],
  methods: {
    // 取消事件
    cancel () {
      this.$emit('cancel')
    },
    // 保存事件
    save () {
      if (this.dlgInfo.type === 'create') { // 新建
        if (!this.params.groupName) {
          this.alert('请输入群组名称', 'error')
          return
        }
        this.$store.dispatch('a:users/saveGroup', this.params).then(
          res => {
            this.$Modal.info({
              title: '提示',
              content: '新建群组成功！',
              onOk: () => {
                this.dlgInfo.showDlg = false
                this.params.groupName = ''
                this.search()
              }
            })
          },
          rej => {
            this.alert(rej.errorInfo, 'error')
          }
        )
      } else if (this.dlgInfo.type === 'edit') { // 修改
        if (!this.params.groupName) {
          this.alert('请输入群组名称', 'error')
          return
        }
        this.$store.dispatch('a:users/updateGroup', this.params).then(
          res => {
            this.$Modal.info({
              title: '提示',
              content: '修改群组成功！',
              onOk: () => {
                this.dlgInfo.showDlg = false
                this.params.groupName = ''
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
    // 删除确认事件
    deleteConfirm () {
      this.$store.dispatch('a:users/deleteGroup', this.params).then(
        res => {
          this.$Modal.info({
            title: '提示',
            content: '删除群组成功！',
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
.line {
  height: 100px;
  div {
    margin: auto;
  }
}
.reminder {
  margin-left: 10px;
  color: red;
}
</style>
