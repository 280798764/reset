<template>
  <section>
    <div class="page-title-wrapper">
      <span class="icon-title"></span>
      <span>群组管理</span>
    </div>
    <section class="filter-wrapper" @keyup.enter="searchBtn">
      <div class="filter-line">
        <label class="app-name-dev">群组名称</label><input type="text" v-model.trim="params.groupName">
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
          <td><div>{{props.item.groupName}}</div></td>
          <td class="operations-td wid-100px">
            <div class="operations flex-center">
              <div class="btn btn-detail" @click.stop="edit('edit', props.item.id, props.item.groupName)">修改</div>
              <div class="btn btn-delete right" @click.stop="deleteItem('delete',props.item.id)">删除</div>
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
    <dialog-group v-if="dlgInfo.showDlg" :dlgInfo="dlgInfo" :params="params" :search="search" @cancel="dlgInfo.showDlg = false"></dialog-group>
  </section>
</template>

<script>
import DialogGroup from './DialogGroup.vue'
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'
const thead = ['序号', '群组名称', '操作']
export default {
  mixins: [mixinsTable, mixinsInfo],
  data () {
    return {
      pageNo: 1, // 页码
      tabCmd: 'a:users/getGroupList', // 查询列表接口url
      thead: thead,
      tbody: [],
      params: {
        groupName: '',
        groupId: ''
      },
      dlgInfo: { // 弹框信息
        showDlg: false,
        type: ''
      }
    }
  },
  components: {
    DialogGroup
  },
  mounted () {
    this.search()
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
    // 新建
    add (type) {
      this.dlgInfo.type = type
      this.dlgInfo.showDlg = true
      this.params.groupName = ''
    },
    // 修改
    edit (type, id, name) {
      this.dlgInfo.type = type
      this.dlgInfo.showDlg = true
      this.params.groupId = id
      this.params.groupName = name
    },
    // 删除
    deleteItem (type, id) {
      this.dlgInfo.type = type
      this.dlgInfo.showDlg = true
      this.params.groupId = id
    },
    // 查询列表
    search () {
      // 参数缓存
      this.saveFilterParams(this.params, this.pageInfoReq.startPage)
      // 获取表单数据
      this.getTableList(this.tabCmd, this.params)
    }
  }
}
</script>

<style lang="less" scoped>
  .btn + .btn {
    margin-left: 10px;
  }
</style>
