<template>
<section>
  <div class="page-title-wrapper" >
    <span class="icon-title"></span>
    <span>已有账号查询</span>
  </div>
  <section class="filter-wrapper" @keyup.enter="searchTab">
    <div class="filter-line">
      <label class="app-name-dev special-first">会员名称</label><input type="text" v-model.trim="params.loginAccount">
      <label class="app-name-dev special-first">手机号码</label><input type="text" v-model.trim="params.mobile">
      <div class="func-btns-wrapper search-reset">
        <div class="func-btn btn-search" @click="searchTab"><i class="iconfont icon-icon-btn-search"></i>查询</div>
      </div>
    </div>
  </section>
  <!-- 表单展示 -->
  <section class="table-wrapper">
    <section class="list-wrapper custom-scroll scroll">
      <custom-table :thead="thead" :tbody="tbody" :scroll="true">
        <template slot="item" slot-scope="props">
          <!--<td><custom-radio :radioChecked="checkId" :value="item.memberCode"></custom-radio></td>-->
          <td><div class="input-radio"><input type="radio" v-model="checkId" :value="props.item.memberCode" /></div></td>
          <td><div>{{props.item.loginAccount}}</div></td>
          <td><div>{{props.item.username}}</div></td>
          <td><div>{{props.item.mobile}}</div></td>
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
  <!-- 底部功能按钮 -->
  <section class="btns-group">
    <div class="btn btn-gray" @click="backForward">返回</div>
    <div class="btn btn-blue" @click="nextGo">下一步</div>
  </section>
</section>
</template>

<script>
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'
const thead = ['选择', '会员名称', '姓名', '手机号']

export default {
  mixins: [mixinsTable, mixinsInfo],
  data () {
    return {
      pageNo: 1, // 页码
      inType: '', // 判断是哪个页面进入此页面
      checkId: '',
      Cmd: '',
      Cmd1: 'a:device/getMemberList',
      Cmd2: 'a:device/getUserList',
      thead: thead,
      tbody: [],
      params: {
        loginAccount: '',
        mobile: ''
      }
    }
  },
  mounted () {
    this.inType = sessionStorage.getItem('inType')
    if (this.inType === '1') {
      this.Cmd = this.Cmd1
    } else {
      this.Cmd = this.Cmd2
    }
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
    // 返回
    backForward () {
      if (this.inType === '1') {
        this.$router.push('/operations/FactoryList')
      } else {
        this.$router.push('/operations/EngineerList')
      }
    },
    // 下一步
    nextGo () {
      if (this.inType === '1') {
        if (this.checkId) {
          sessionStorage.setItem('memberCode', this.checkId)
          sessionStorage.setItem('goToUpdate', 2)
          this.$store.dispatch('a:device/toFacUser', {memberCode: this.checkId}).then(
            res => {
              this.$router.push('/operations/Update')
            }
          )
        } else {
          this.alert('请选择列表数据!', 'warning')
        }
      } else {
        if (this.checkId) {
          // 用户成为工程师
          this.$store.dispatch('a:device/toUserRepair', {memberCode: this.checkId}).then(
            () => {
              this.alert('用户加入维修工程师成功!', 'success')
              setTimeout(() => {
                this.$router.push('/operations/EngineerList')
              }, 1000)
            }
          )
        } else {
          this.alert('请选择列表数据!', 'warning')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
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
