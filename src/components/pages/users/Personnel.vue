<template>
  <section>
    <div class="page-title-wrapper">
      <span class="icon-title"></span>
      <span>人员管理</span>
    </div>
    <section class="filter-wrapper" @keyup.enter="searchBtn">
      <div class="filter-line">
        <label class="app-name-dev">姓名</label><input type="text" v-model.trim="params.fullName">
        <label class="app-name-dev">用户名</label><input type="text" v-model.trim="params.memberName">
        <label>群组</label>
        <div class="select-wrapper">
          <Select v-model="params.groupId" clearable>
            <Option v-for="item in groups" :value="item.id" :key="item.id">{{item.groupName}}</Option>
          </Select>
        </div>
        <section class="func-btns-wrapper reset-func-btns-wrapper">
          <div class="func-btn btn-search" @click="searchBtn"><i class="iconfont icon-icon-btn-search"></i>查询</div>
        </section>
      </div>
    </section>
    <section class="func-btns-wrapper">
      <div class="func-btn btn-create" @click="add('create')"><i class="iconfont icon-icon-btn-create"></i>新建</div>
    </section>
    <!--列表展示-->
    <section  class="list-wrapper">
      <custom-table :thead="thead" :tbody="tbody" :layoutFixed="true">
        <template slot="item" slot-scope="props">
          <td><div>{{props.index + 1}}</div></td>
          <td><div>{{props.item.name}}</div></td>
          <td><div>{{props.item.memberName}}</div></td>
          <td><div>{{props.item.phone}}</div></td>
          <td><div>{{props.item.email}}</div></td>
          <td><div>{{props.item.groupName}}</div></td>
          <td><div>{{props.item.roleName}}</div></td>
          <td class="operations-td wid-100px">
            <div class="operations flex-center">
              <div class="btn btn-detail" @click.stop="edit('edit', props.item)">修改</div>
              <div class="btn btn-detail" @click.stop="reset('reset', props.item.memberCode)">重置密码</div>
              <div class="btn btn-delete left"  @click.stop="deleteItem('delete', props.item)">删除</div>
            </div>
          </td>
        </template>
      </custom-table>
      <div style="margin: 20px auto" class="pageStyle">
        <div class="left">
          <span>跳转至</span>
          <input type="number" v-model.trim="pageNo" v-on:blur="jumpTo" v-on:keyup.enter="jumpTo">
          <span>页</span>
        </div>
        <Page :total="pageInfo.totalCount" :page-size="10" :current="pageInfo.pageNo" @on-change="changepage" class="Page"/>
        <div class="total-pages">
          <span>共</span>
          <span class="count">{{pageInfo.totalPageCount}}</span>
          <span>页</span>
        </div>
      </div>
    </section>
    <dialog-personal v-if="dlgInfo.showDlg" :dlgInfo="dlgInfo" :search="search" :itemDelete="itemDelete" :memberCode="memberCode" :itemObject="itemObject" :groups="groups" @cancel="dlgInfo.showDlg = false"></dialog-personal>
  </section>
</template>

<script>
import DialogPersonal from './DialogPersonal.vue'
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'
const thead = ['序号', '姓名', '用户名', '手机号', '邮箱', '群组', '角色', '操作']
export default {
  mixins: [mixinsTable, mixinsInfo],
  data () {
    return {
      pageNo: 1, // 页码
      tabCmd: 'a:users/findUserInfoList', // 查询列表接口url
      thead: thead,
      tbody: [],
      groups: [], // 群组下拉数据
      memberCode: '', // 用户code 删除的参数
      itemObject: {}, // 修改修改的对象
      itemDelete: {}, // 删除的对象
      params: {
        fullName: '', // 姓名(非必传)
        groupId: null, // 群组id(非必传)
        memberName: '' // 用户名(非必传)
      },
      dlgInfo: { // 弹框信息
        showDlg: false,
        type: ''
      }
    }
  },
  components: {
    DialogPersonal
  },
  mounted () {
    this.search()
    this.getGroups()
  },
  methods: {
    jumpTo () {
      this.pageChange()
    },
    pageChange () {
      let pages = Math.ceil(this.pageInfo.totalCount / 10)
      if (this.pageNo > pages || this.pageNo <= 0) {
        this.alert('请输入正确的页码！', 'error')
      } else {
        this.pageInfoReq.page = this.pageNo
        this.pageInfo.page = +this.pageNo
        this.getTableList(this.tabCmd, this.params)
      }
    },
    changepage (index) {
      this.pageInfoReq.page = index
      this.getTableList(this.tabCmd, this.params)
      this.pageNo = index
    },
    getGroups () {
      this.$store.dispatch('a:users/getAllGroups', this.params).then(
        res => {
          this.groups = res || []
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    // 查询列表
    search () {
      if (this.params.groupId === '') {
        this.params.groupId = null
      }
      // 参数缓存
      this.saveFilterParams(this.params, this.pageInfoReq.startPage)
      // 获取表单数据
      this.getTableList(this.tabCmd, this.params)
    },
    // 新建用户
    add (type) {
      this.dlgInfo.type = type
      this.dlgInfo.showDlg = true
    },
    // 修改
    edit (type, itemObject) {
      this.dlgInfo.type = type
      this.dlgInfo.showDlg = true
      this.itemObject = itemObject
    },
    // 重置密码
    reset (type, memberCode) {
      sessionStorage.setItem('memberCode', memberCode)
      this.dlgInfo.type = type
      this.dlgInfo.showDlg = true
    },
    // 删除
    deleteItem (type, deleteItem) {
      this.dlgInfo.type = type
      this.dlgInfo.showDlg = true
      this.itemDelete = deleteItem
    }
  }
}
</script>

<style lang="less" scoped>
  .btn + .btn {
    margin-left: 10px;
  }
</style>
