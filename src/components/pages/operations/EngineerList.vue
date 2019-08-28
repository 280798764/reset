<template>
  <section style="background-color: #eee;">
    <div class="page-title-wrapper" >
      <span class="icon-title"></span>
      <span>工程师管理</span>
    </div>
    <!--过滤条件-->
    <section class="filter-wrapper" @keyup.enter="searchTab">
      <div class="filter-line">
        <label class="app-name-dev special-first">手机号</label><input type="text" v-model.trim="params.mobile">
        <label class="app-name-dev special-first">名称</label><input type="text" v-model.trim="params.username">
        <div class="func-btns-wrapper search-reset">
          <div class="func-btn btn-search" @click="searchTab"><i class="iconfont icon-icon-btn-search"></i>查询</div>
        </div>
      </div>
    </section>
    <section class="func-btns-wrapper">
      <div class="func-btn btn-create" @click="createAccount('create')">账号创建</div>
      <div class="func-btn btn-create" @click="searchAccount('create')">已有账号查询</div>
    </section >
    <!-- 表单展示 -->
    <section class="table-wrapper">
      <section class="list-wrapper custom-scroll scroll">
        <custom-table :thead="thead" :tbody="tbody" :scroll="true">
          <template slot="item" slot-scope="props">
            <td><div>{{props.item.loginAccount}}</div></td>
            <td><div>{{props.item.username}}</div></td>
            <td><div>{{props.item.email}}</div></td>
            <td><div>{{props.item.memberCode}}</div></td>
            <td class="operations-td wid-100px">
              <div class="operations flex-center">
                <div class="btn btn-delete" @click="deleteList(props.item.memberCode)">删除</div>
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
          <Page :total="pageInfo.total" :page-size="10" :current="pageInfo.pageNum" @on-change="changepage" class="Page"/>
          <div class="total-pages">
            <span>共</span>
            <span class="count">{{pageInfo.totalPageCount}}</span>
            <span>页</span>
          </div>
        </div>
        <!--<pagination v-if="pageInfo.totalPageCount" :pageInfo="pageInfo" @pageChange="pageChange"></pagination>-->
      </section>
    </section>
    <dialog-delete v-if="dlgInfo.showDlg" :trueDelete="trueDelete" @cancel="dlgInfo.showDlg = false"></dialog-delete>
  </section>
</template>

<script>
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'
const thead = ['手机号', '名称', 'email', 'memberCode', '操作']

export default {
  mixins: [mixinsTable, mixinsInfo],
  data () {
    return {
      pageNo: 1, // 页码
      Cmd: 'a:device/getUserRepairList',
      thead: thead, // 表格头
      tbody: [], // 表格内容
      params: {
        username: '',
        mobile: ''
      },
      deleteParams: {
        memberCode: ''
      },
      dlgInfo: { // 弹框的显示状态
        showDlg: false,
        type: ''
      }
    }
  },
  components: {
    dialogDelete
  },
  mounted () {
    this.getTableList(this.Cmd, this.params)
  },
  methods: {
    jumpTo () {
      this.pageChange()
    },
    pageChange () {
      let pages = Math.ceil(this.pageInfo.total / 10)
      if (this.pageNo > pages || this.pageNo <= 0) {
        this.alert('请输入正确的页码！', 'error')
      } else {
        this.pageInfoReq.page = this.pageNo
        // this.pageInfo.page = +this.pageNo
        this.getTableList(this.Cmd, this.params)
      }
    },
    changepage (index) {
      this.pageInfoReq.page = index
      this.getTableList(this.Cmd, this.params)
      this.pageNo = index
    },
    // 创建账号
    createAccount () {
      sessionStorage.setItem('inType', 2)
      this.$router.push('/operations/RegUser')
    },
    // 已有账号查询
    searchAccount () {
      sessionStorage.setItem('inType', 2)
      this.$router.push('/operations/GetUser')
    },
    // 查询列表
    search () {
      // 参数缓存
      this.saveFilterParams(this.params, this.pageInfoReq.startPage)
      // 获取表单数据
      this.getTableList(this.Cmd, this.params)
    },
    searchTab () {
      this.pageInfoReq.page = 1
      this.pageNo = 1
      this.getTableList(this.Cmd, this.params)
    },
    // 详情
    readRecord (boxNo) {
      sessionStorage.setItem('boxNo', boxNo)
      this.$router.push('/device/detail')
    },
    deleteList (memberCode) {
      this.dlgInfo.showDlg = true
      this.deleteParams.memberCode = memberCode
    },
    trueDelete () {
      this.$store.dispatch('a:device/delUserRepair', this.deleteParams).then(
        res => {
          this.$Modal.info({
            title: '提示',
            content: '删除成功!',
            onOk: () => {
              this.getTableList(this.Cmd, this.params)
            }
          })
          // this.alert('删除成功！', 'success')
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
  .matching-wrapper > label {
    width: 63px !important;
  }
  .pageStyle {
    display: flex;
    margin: 20px 0;
    padding: 0 50px;
    .Page {
      min-width: 30%;
      margin: 0 auto;
      ul {
        float: right;
      }
    }
    .left {
      float: left;
      input {
        margin: 0 12px;
        width: 50px;
        height: 24px;
        color: #B2B2B2;
        text-align: center;
        outline: none;
        border: 1px solid #C9C9C9;
        border-radius: 20px;
      }
    }
    .total-pages {
      display: inline-flex;
      margin-left: 42px;
      line-height: 24px;
      .count {
        margin: 0 11px;
      }
    }
  }
</style>
