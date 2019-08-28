<template>
  <section style="background-color: #eee;">
    <div class="page-title-wrapper" >
      <span class="icon-title"></span>
      <span>合同实施管理</span>
    </div>
    <div class="tabWrapper">
      <div>
        <p>待实施合同数量</p>
        <h1>{{totalStatistics.unImplAgreeementCount}}</h1>
      </div>
      <div>
        <p>待实施设备数量</p>
        <h1>{{totalStatistics.implDeviceCount}}</h1>
      </div>
      <div>
        <p>到期合同数量</p>
        <h1>{{totalStatistics. unRecoveryAgreeementCount}}</h1>
      </div>
      <div>
        <p>待回收设备数量</p>
        <h1>{{totalStatistics.recoveryDeviceCount}}</h1>
      </div>
    </div>
    <!--过滤条件-->
    <section class="filter-wrapper" @keyup.enter="searchTab">
      <div class="filter-line">
        <label class="app-name-dev special-first">合同编号</label><input type="text" v-model.trim="params.agreementNo">
        <label class="app-name-dev special-first">客户名称</label><input type="text" v-model.trim="params.companyName">
        <label>合同状态</label>
        <div class="select-wrapper">
           <Select v-model="params.agreementStatus" clearable>
             <Option v-for="item in agreementStatusList" :value="item.key" :key="item.key">{{item.value}}</Option>
           </Select>
        </div>
        <label>设备实施状态</label>
        <div class="select-wrapper">
          <Select v-model="params.implementStatus" clearable>
            <Option v-for="item in implementStatusList" :value="item.key" :key="item.key">{{item.value}}</Option>
          </Select>
        </div>
        <label class="app-name-dev special-first">负责人</label><input type="text" v-model.trim="params.customerServiceName">
      </div>
      <div  class="filter-line" id="resetTimeLable">
        <date-range ref="dateRange" label="生效日期" class="date-wrapper" :dateFrom="params.effectDateStart" :dateTo="params.effectDateEnd"></date-range>
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
            <td><div>{{props.item.effectDate}}</div></td>
            <td>
              <div>
                <p class="ellipsis" :title="props.item.agreementNo">{{props.item.agreementNo}}</p>
              </div>
            </td>
            <td>
              <div>
                <p class="ellipsis" :title="props.item.companyName">{{props.item.companyName}}</p>
              </div>
            </td>
            <td><div>{{props.item.agreementStatusName}}</div></td>
            <!--<td><div>{{props.item.postion}}</div></td>-->
            <td><div>{{props.item.boxChargeCount}}</div></td>
            <td>
              <div class="operations flex-center two-lin">
               <div>
                 <p>{{props.item.implementStatusName}}</p>
                 <p>
                   <span v-if="props.item.implementStatus !== '30' &&  props.item.implementStatus !== '60'" class="lightColor"  @click.stop="setFinish(props.item.agreementNo, props.item.implementStatus)">设置完成</span>
                 </p>
               </div>
              </div></td>
            <td><div>{{props.item.insertMtCount}}/{{props.item.implDeviceCount}}</div></td>
            <td><div>{{props.item.deleteMtCount}}/{{props.item.recoverDeviceCount}}</div></td>
            <td class="operations-td wid-100px">
              <div class="operations flex-center two-lin">
                <div>
                  <p> {{props.item.sendCount}}</p>
                  <p><span class="lightColor" @click.stop="readRecord(props.item.agreementNo, props.item.implementStatus)">查看记录</span></p>
                </div>
              </div>
            </td>
            <td><div>{{props.item.customerServiceName}}</div></td>
            <td class="operations-td wid-100px">
              <div class="operations flex-center">
                <div class="btn btn-detail" @click.stop="readDetail(props.item.agreementNo)">查看详情</div>
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
        <!--<pagination v-if="pageInfo.totalPageCount" :pageInfo="pageInfo" @pageChange="pageChange"></pagination>-->
      </section>
    </section>
    <dialog-record v-if="dlgInfo.showDlg" :dlgInfo="dlgInfo" @cancel="dlgInfo.showDlg = false"></dialog-record>
  </section>
</template>

<script>
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'
import DialogRecord from './DialogRecord'

// const thead = ['序列号', 'VPN IP', 'VPN Server', '公网 IP', '定位', '数据流入', '数据流出', '最近接入日期', 'Last Ping', '在线时长']
const thead = ['生效日期', '合同编号', '客户名称', '合同状态', '设备总数量', '实施状态', '设备实施状态', '设备回收状态', '派工次数', '合同负责人', '操作']

export default {
  mixins: [mixinsTable, mixinsInfo],
  data () {
    return {
      resInfo: '',
      pageNo: 1, // 页码
      Cmd: 'a:contract/getContractList',
      thead: thead, // 表格头
      tbody: [], // 表格内容
      params: {
        agreementNo: '', // 合同编号
        agreementStatus: '', // 合同状态
        companyName: '', // 客户名称
        customerServiceName: '', // 负责人
        effectDateEnd: '', // 结束时间
        effectDateStart: '', // 开始时间
        implementStatus: '' // 设备实施状态
      },
      totalStatistics: {
        implDeviceCount: '', // 待实施设备数量- 总数量
        recoveryDeviceCount: '', // 待回收设备数量 -总数量
        unImplAgreeementCount: '', // 待实施合同数量
        unRecoveryAgreeementCount: '' // 待回收（到期）合同数量
      }, // 数量统计
      agreementStatusList: [], // 合同状态
      implementStatusList: [], // 设备实施状态
      dlgInfo: { // 弹框信息
        showDlg: false,
        type: ''
      },
      paramsSet: {
        agreementNo: '', // 合同编号
        implementStatus: ''// 实施状态
      }
    }
  },
  components: {
    DialogRecord
  },
  mounted () {
    this.getList()
    this.getStatusList() // 合同状态
    this.getTotalStatistics() // 数量统计
    this.getImplStatusList() // 设备实施状态列表
  },
  methods: {
    // 设置完成
    // a:contract/updataOrderStatus
    setFinish (agreementNo, implementStatus) {
      this.paramsSet.agreementNo = agreementNo
      this.paramsSet.implementStatus = implementStatus
      this.$store.dispatch('a:contract/updataOrderStatus', this.paramsSet).then(
        res => {
          this.alert('设置成功！', 'success')
          this.getList()
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    // 查看记录
    readRecord (agreementNo, implementStatus) {
      sessionStorage.setItem('InAgreementNo', agreementNo)
      sessionStorage.setItem('InImplementStatus', implementStatus)
      this.dlgInfo.showDlg = true
      sessionStorage.setItem('agreementNo', agreementNo)
    },
    // 查看详情
    readDetail (agreementNo) {
      sessionStorage.setItem('agreementNoDetail', agreementNo)
      this.$router.push('/contract/detail')
      sessionStorage.setItem('backParams', JSON.stringify(this.params))
      this.saveFilterParams(this.params, this.pageInfoReq.page)
      sessionStorage.setItem('savePageStart', this.pageInfoReq.page)
    },
    getList () {
      this.getTableList(this.Cmd, this.params)
    },
    // 合同状态
    getStatusList () {
      this.$store.dispatch('a:contract/getStatusList', {}).then(
        res => {
          this.agreementStatusList = res || {}
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    // 设备实施状态列表
    getImplStatusList () {
      this.$store.dispatch('a:contract/getImplStatusList', {}).then(
        res => {
          this.implementStatusList = res || {}
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    // 数据统计
    getTotalStatistics () {
      this.$store.dispatch('a:contract/getTotalStatistics', {}).then(
        res => {
          this.totalStatistics = res || {}
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    changeOnline () {
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
      if (this.$refs.dateRange) {
        this.params.effectDateStart = this.$refs.dateRange.getDateRange().dateFrom || ''
        this.params.effectDateEnd = this.$refs.dateRange.getDateRange().dateTo
      }
      this.pageInfoReq.page = 1
      this.pageNo = 1
      this.getTableList(this.Cmd, this.params)
    }
  }
}
</script>

<style lang="less" scoped>
  .tbody tr td{
    padding-bottom: 3px !important;
  }
  .table-wrapper table tbody tr td {
    padding-bottom: 3px;
    max-width: 300px;
  }
  .table-wrapper table tbody tr td > div {
    display: flex;
    height: 100% !important;
    align-items: center !important;
    justify-content: center;
    .ellipsis {
      width: 100%;
      box-sizing: border-box;
      padding: 0 5px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .range-wrapper {
    margin-left: -33px;
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
  .lightColor {
    color: #269FD6;
    cursor: pointer;
  }

</style>
