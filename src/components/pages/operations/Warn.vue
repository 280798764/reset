<template>
  <section>
    <div class="page-title-wrapper" >
      <span class="icon-title"></span>
      <span>流量预警管理</span>
    </div>
    <div class="filter-wrapper">
      <div class="filter-line resetLine">
        <label class="app-name-dev special-first">剩余流量警戒线：</label>
        <div v-if="editWarnVale">
          <input type="number" class="editWarnInput" v-model="warnVale">
          <span>M</span>
          <span class="editWarnVale" @click="editVal2">修改</span></div>
        <div v-else>
          <span>{{warnVale}}</span>
          <span>M</span>
          <span class="editWarnVale" @click="editVal1">修改</span>
        </div>
      </div>
    </div>
    <!--过滤条件-->
    <section class="filter-wrapper" @keyup.enter="searchTab">
      <div class="filter-line">
        <label class="app-name-dev">账期选择</label>
        <div class="select-wrapper">
          <Select v-model="params.month" clearable>
            <Option v-for="item in monthList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </div>
        <div class="func-btns-wrapper search-reset">
          <div class="func-btn btn-search" @click="searchTab"><i class="iconfont icon-icon-btn-search"></i>查询</div>
        </div>
      </div>
    </section>
    <section class="func-btns-wrapper">
      <div class="func-btn btn-create" @click="imports('create')">批量导出</div>
    </section >
    <!-- 表单展示 -->
    <section class="table-wrapper">
      <section class="list-wrapper custom-scroll scroll">
        <custom-table :thead="thead" :tbody="tbody" :scroll="true">
          <template slot="item" slot-scope="props">
            <td><div>{{props.item.startDate}}</div></td>
            <td><div>{{props.item.inlineCount}}</div></td>
            <td><div>{{props.item.warnCount}}</div></td>
            <td><div>{{props.item.val}}M</div></td>
            <td><div>{{props.item.selectTime}}S</div></td>
            <td class="operations-td wid-100px">
              <div class="operations flex-center">
                <div class="btn btn-detail" @click.stop="readRecord(props.item.startDate)">详情</div>
              </div>
            </td>          </template>
        </custom-table>
        <!--<div style="margin: 20px auto" class="pageStyle">
          <div class="left">
            <span>跳转至</span>
            <input type="text" v-model.trim="pageNo" v-on:blur="jumpTo" v-on:keyup.enter="jumpTo">
            <span>页</span>
          </div>
          <Page :total="pageInfo.totalCount" :page-size="10" :current="pageInfo.pageNo" @on-change="changepage" class="Page"/>
          <div class="total-pages">
            <span>共</span>
            <span class="count">{{pageInfo.totalPageCount}}</span>
            <span>页</span>
          </div>
        </div>-->
      </section>
    </section>
    <dialog-Warn v-if="dlgInfo.showDlg" :dlgInfo="dlgInfo" @cancel="dlgInfo.showDlg = false"></dialog-Warn>
  </section>
</template>

<script>
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'
import DialogWarn from './DialogWarnDeatil'
import { DOMAIN } from '@/utils/config'
const thead = ['日期', '在线卡数', '警报数量', '剩余流量警戒线', '查询时间', '操作']
export default {
  mixins: [mixinsTable, mixinsInfo],
  data () {
    return {
      editWarnVale: false,
      warnVale: '', // 剩余流量警戒线
      cmd: 'a:operations/getWarnList',
      pageNo: 1,
      tbody: [],
      thead: thead,
      params: {
        month: ''
      },
      params2: {},
      resInfo: {
      },
      pageInfo: {},
      detailInfo: {},
      dlgInfo: { // 弹框信息
        showDlg: false,
        type: ''
      }
    }
  },
  components: {
    DialogWarn
  },
  created () {
    let month = (new Date().getMonth() + 1) > 10 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)
    this.params.month = new Date().getFullYear() + '-' + month
    this.date = new Date().getFullYear() + '-' + month
  },
  mounted () {
    this.getWranVal()
    this.searchTab()
  },
  methods: {
    // 修改剩余流量警戒线
    editVal1 () {
      this.editWarnVale = true
    },
    // 修改剩余流量警戒线
    editVal2 () {
      if (this.warnVale <= 0) {
        this.alert('请输入大于零的值！')
        return
      }
      this.$store.dispatch('a:operations/updateWranVal', {val: this.warnVale}).then(
        res => {
          this.editWarnVale = false
          this.$Message.success('修改完成')
          this.searchTab()
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    getWranVal () {
      this.$store.dispatch('a:operations/getWranVal', {}).then(
        res => {
          this.warnVale = res.val || ''
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    imports () {
      window.location.href = `${DOMAIN.originExport}/exportWarn?userToken=${window.sessionStorage.getItem('userToken')}&&month=${this.params.month}`
    },
    readRecord (date) {
      this.dlgInfo.showDlg = true
      sessionStorage.setItem('detailDate', date)
      sessionStorage.setItem('backParams', JSON.stringify(this.params))
      this.saveFilterParams(this.params, this.pageInfoReq.page)
      sessionStorage.setItem('savePageStart', this.pageInfoReq.page)
    },
    searchTab () {
      if (!this.params.month) {
        this.alert('账期选择不能为空！')
        return
      }
      if (this.params.month > this.date) {
        this.alert('账期选择不能超过当前月！')
        return
      }
      this.$store.dispatch(this.cmd, this.params).then(
        res => {
          this.tbody = res || {}
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
    }
  }
}
</script>

<style lang="less" scoped>
.filter-wrapper .resetLine > label:first-child {
  width: 110px;
}
  .editWarnVale {
    color: #2db7f5;
    margin-left: 10px;
    cursor: pointer;
    user-select: none;
  }
  .editWarnInput {
    width: 70px;
    height: 25px;
    line-height: 25px;
    border-radius: 3px;
    outline: none;
    border: 1px solid #C9C9C9;
    padding-left: 5px;
  }
</style>
