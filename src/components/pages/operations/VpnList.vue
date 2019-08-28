<template>
  <section style="background-color: #eee;">
    <div class="page-title-wrapper" >
      <span class="icon-title"></span>
      <span>VPN监控</span>
    </div>
    <div class="tabWrapper">
      <div>
        <p>在线设备总数</p>
        <h1>{{resInfo.mtCount}}</h1>
      </div>
      <div>
        <p>活跃 VPN 服务器总数</p>
        <h1>{{resInfo.serverCount}}</h1>
      </div>
      <div>
        <p>数据流入总量</p>
        <h1>{{resInfo. byteInCount}} GiB</h1>
      </div>
      <div>
        <p>数据流出总量</p>
        <h1>{{resInfo.byteOutCount}} GiB</h1>
      </div>
    </div>
    <!--过滤条件-->
    <section class="filter-wrapper" @keyup.enter="searchTab">
      <div class="filter-line">
        <label class="app-name-dev special-first">设备序列号</label><input type="text" v-model.trim="params.boxNo">
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
            <td><div>{{props.item.boxNo}}</div></td>
            <td><div>{{props.item.vpnIp}}</div></td>
            <td><div>{{props.item.verServer}}</div></td>
            <td><div>{{props.item.realIp}}</div></td>
            <!--<td><div>{{props.item.postion}}</div></td>-->
            <td><div>{{props.item.byteIn}} M</div></td>
            <td><div>{{props.item.byteOut}} M</div></td>
            <td><div>{{props.item.conSince}}</div></td>
            <td><div>{{props.item.lastRef}}</div></td>
            <td><div>{{props.item.compareTime}}</div></td>
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
        <!--<pagination v-if="pageInfo.totalPageCount" :pageInfo="pageInfo" @pageChange="pageChange"></pagination>-->
      </section>
    </section>
    <dialog-export v-if="dlgInfo.showDlg" :dlgInfo="dlgInfo" @cancel="dlgInfo.showDlg = false"></dialog-export>
  </section>
</template>

<script>
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'
// const thead = ['序列号', 'VPN IP', 'VPN Server', '公网 IP', '定位', '数据流入', '数据流出', '最近接入日期', 'Last Ping', '在线时长']
const thead = ['设备序列号', 'VPN IP', 'VPN Server', '公网 IP', '数据流入', '数据流出', '最近接入日期', 'Last Ping', '在线时长']

export default {
  mixins: [mixinsTable, mixinsInfo],
  data () {
    return {
      resInfo: '',
      pageNo: 1, // 页码
      Cmd: 'a:operations/getVpnList',
      thead: thead, // 表格头
      tbody: [], // 表格内容
      params: {
        boxNo: '' // 设备序列号
      },
      dlgInfo: { // 弹框信息
        showDlg: false,
        type: ''
      }
    }
  },
  mounted () {
    this.getList()
    this.getBaseInfo()
  },
  methods: {
    getList () {
      this.getTableList(this.Cmd, this.params)
    },
    getBaseInfo () {
      this.$store.dispatch('a:operations/getVpnBasicMsg', {}).then(
        res => {
          this.resInfo = res || {}
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
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
        this.getTableList(this.Cmd, this.params)
      }
    },
    changepage (index) {
      this.pageInfoReq.page = index
      this.getTableList(this.Cmd, this.params)
      this.pageNo = index
    },
    searchTab () {
      this.pageInfoReq.page = 1
      this.pageNo = 1
      this.getTableList(this.Cmd, this.params)
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
  .operations.flex-center > .btn:nth-of-type(1) {
    margin-right: 10px;
  }
  .matching-wrapper > label {
    width: 63px !important;
  }
  .ivu-page-options {
    background-color: red !important;
  }
  .tabWrapper {
    width: 100%;
    display: flex;
    div {
      width: 24%;
      height: 110px;
      flex: 1;
      background-color: #fff;
      border: 1px solid rgba(121, 121, 121, 1);
      margin-right: 3px;
      p {
        height: 50px;
        line-height: 50px;
      }
      p,h1 {
        text-align: center;
      }
    }
  }
  .filter-wrapper {
    margin-top: 10px;
  }
</style>
