<!-- 应用上架还是下架 -->
<template>
  <section class="dialog-wrapper">
    <div class="dialog">
      <div class="dialog-header">
        <span v-if="dlgInfo.type === 'create'">新增角色</span>
        <span v-if="dlgInfo.type === 'edit'">修改角色</span>
        <span v-if="dlgInfo.type === 'delete'">删除角色</span>
        <span class="dlg-close"><i class="iconfont close" @click="cancel"></i></span>
      </div>
      <div class="dialog-body">
        <div v-if="dlgInfo.type !== 'delete'">
          <div class="line">
            <label class="required">角色名称：</label>
            <input type="text" v-model.trim="createParams.roleName" placeholder="请输入群组名称">
          </div>
          <div  class="line">
            <label class="required">角色权限：</label>
          </div>
          <div class="menu">
            <Tree :data="menus" show-checkbox multiple @on-check-change="select"></Tree>
          </div>
        </div>
        <div class="line" v-show="false">
          <label class="required">备注说明：</label>
          <input type="text" v-model.trim="createParams.remark" placeholder="请输入备注说明">
        </div>
        <div v-if="dlgInfo.type === 'delete'">
          <div class="line delete-line">
            <div>确认删除当前角色？</div>
          </div>
        </div>
      </div>
      <div class="dialog-footer">
        <div class="btn btn-cancel wid-70px mr-15px" @click="cancel">取消</div>
      <div class="btn btn-sure wid-70px mr-15px" v-if="dlgInfo.type !== 'delete'" @click="save()">保存</div>
        <div class="btn btn-sure wid-70px mr-15px" v-if="dlgInfo.type === 'delete'" @click="deleteItem">删除</div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      menus: [],
      children: [],
      checked: [],
      createParams: { // 新建角色参数
        pageIds: '',
        roleName: ''
      },
      deleteParams: { // 删除参数
        roleId: ''
      }
    }
  },
  props: ['dlgInfo', 'search', 'params', 'roleId', 'itemObject'],
  mounted () {
    this.getRole()
  },
  methods: {
    // 获取角色权限
    getRole () {
      // 修改
      if (this.dlgInfo.type === 'edit') {
        this.createParams.roleName = this.itemObject.roleName
        this.createParams.roleId = this.itemObject.roleid
        this.$store.dispatch('a:users/getRolePages', {roleId: this.itemObject.roleid}).then(
          res => {
            if (res) {
              this.createParams.pageIds = res.map(item => {
                return item.pageId
              })
            }
          },
          rej => {
            this.alert(rej.errorInfo, 'error')
          }
        )
      }
      setTimeout(() => {
        this.$store.dispatch('a:users/findModules', {}).then( // 获取菜单
          res => {
            this.menus = res.map(val => {
              return {
                title: val.moduleName,
                children: val.pages.map(item => {
                  return {
                    pageId: item.pageId,
                    title: item.pageName,
                    checked: this.createParams.pageIds.includes(item.pageId) ? 'true' : false
                  }
                })
              }
            })
          },
          rej => {
            this.alert(rej.errorInfo, 'error')
          }
        )
        this.deleteParams.roleId = this.roleId
      }, 300)
    },
    // 选中的菜单--获取参数ids
    select (vaule) {
      var idsArray = vaule.filter(item => {
        return item.pageId
      })
      this.createParams.pageIds = idsArray.map(item => {
        return item.pageId
      })
    },
    // 取消
    cancel () {
      this.$emit('cancel')
    },
    // 保存
    save () {
      if (!this.createParams.roleName) {
        this.alert('请输入角色名称！', 'error')
        return
      } else if (!this.createParams.pageIds) {
        this.alert('请输入角色权限！', 'error')
        return
      }
      if (this.dlgInfo.type === 'create') { // 新建
        this.$store.dispatch('a:users/saveRole', this.createParams).then(
          res => {
            this.$Modal.info({
              title: '提示',
              content: '新建角色成功！',
              onOk: () => {
                this.dlgInfo.showDlg = false
                this.params.name = ''
                this.createParams.pageIds = []
                this.search()
              }
            })
          },
          rej => {
            this.alert(rej.errorInfo, 'error')
          }
        )
      } else if (this.dlgInfo.type === 'edit') { // 修改
        if (!this.createParams.pageIds) {
          this.alert('请输入角色权限！', 'error')
          return
        }
        this.$store.dispatch('a:users/updateRole1', this.createParams).then(
          res => {
            this.$Modal.info({
              title: '提示',
              content: '修改角色成功！',
              onOk: () => {
                this.dlgInfo.showDlg = false
                this.params.name = ''
                this.search()
                this.createParams.roleName = ''
                this.createParams.pageIds = []
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
      this.$store.dispatch('a:users/deleteRole1', this.deleteParams).then(
        res => {
          this.$Modal.info({
            title: '提示',
            content: '删除角色成功！',
            onOk: () => {
              this.dlgInfo.showDlg = false
              this.params.name = ''
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
  div {
    margin: auto;
  }
}
.delete-line {
  height: 100px;
}
.menu {
  margin: 0 auto;
  padding-left: 20px;
  width: 80%;
  min-height: 250px;
  overflow: auto;
  border: 1px solid #666;
}
</style>
