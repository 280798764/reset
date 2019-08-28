<template>
  <section style="background-color: #eee;">
    <div class="page-title-wrapper" >
      <span class="icon-title"></span>
      <span>工厂管理</span>
    </div>
    <!--过滤条件-->
    <section class="filter-wrapper " @keyup.enter="searchTab">
      <div class="filter-line">
        <label class="app-name-dev special-first">厂家名称</label>
        <div class="select-wrapper select-wrapper2">
          <Row>
            <Col span="12" style="padding-right:10px; width: 348px">
            <Select
              v-model="params.factoryId"
              filterable clearable
              remote :remote-method="remoteMethod"
              :loading="loading">
              <Option v-for="(option, index) in factoryId" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
            </Col>
          </Row>
        </div>
        <!--<matching-id title="厂家名称" :id="params.factoryId" ref="client1" :cmdId="1" labelWidth="firstLabelWid" :inputWidth="clientInputWid"></matching-id>-->
        <label class="app-name-dev special-first">账号名</label><input type="text" v-model.trim="params.memberName">
        <label class="app-name-dev special-first">业务人员</label><input type="text" v-model.trim="params.businessPerson">
      </div>
      <div class="filter-line">
        <label>申请来源</label>
        <div class="select-wrapper">
          <Select v-model="params.applySourceId" clearable>
            <Option v-for="item in applySourceId" :value="item.id" :key="item.id">{{item.applySource}}</Option>
          </Select>
        </div>
        <label>状态</label>
        <div class="select-wrapper">
          <Select v-model="params.status" clearable>
            <Option v-for="item in status" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </div>
        <date-range ref="dateRange" label="开通日期" class="date-wrapper" :dateFrom="params.beginDate" :dateTo="params.endDate"></date-range>
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
            <td><div>{{props.item.facCount}}</div></td>
            <td>
              <div style="height: 100%">
              <ul class="height-ul">
                <li style="list-style: none" v-for="(nameF,index) in props.item.facName" :key="index">{{nameF}}</li>
              </ul>
            </div></td>
            <td><div>{{props.item.mtCount}}</div></td>
            <td><div>{{props.item.businessPerson}}</div></td>
            <td><div>{{props.item.applySourceId | applySourceId}}</div></td>
            <td><div>{{props.item.operationPerson}}</div></td>
            <td><div>{{props.item.createDate}}</div></td>
            <td><div>{{props.item.operation | operation}}</div></td>
            <td class="operations-td wid-100px">
              <div class="operations flex-center">
                <div class="btn btn-detail" @click.stop="reset(props.item.memberCode)">设置</div>
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
      </section>
    </section>
    <dialog-export v-if="dlgInfo.showDlg" :dlgInfo="dlgInfo" @cancel="dlgInfo.showDlg = false"></dialog-export>
  </section>
</template>

<script>
import { MatchingId, ClientArea } from '@/components/matching'
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'
import tool from '@/utils/tool'
const thead = ['账号', '姓名', '关联工厂数', '厂家名称', '设备数量', '业务人员', '申请来源', '操作人', '创建日期', '状态', '操作']

export default {
  mixins: [mixinsTable, mixinsInfo],
  data () {
    return {
      loading: false,
      pageNo: 1, // 页码
      factoryId: [], // 厂家名称
      applySourceId: [], // 申请来源
      status: [], // 状态
      Cmd: 'a:device/selectIboxFacList',
      typeId: [], // 设备型号
      rentType: [], // 业务状态
      propertyId: [], // 所有权
      useId: [], // 所有权
      runType: [], // 运行模式
      thead: thead, // 表格头
      tbody: [], // 表格内容
      params: {
        factoryId: '', // 厂家名称
        applySourceId: '', // 申请来源
        status: '', // 状态
        businessPerson: '', // 业务人员
        memberName: '', // 账号名
        beginDate: '', // 开始时间
        endDate: ''// 结束时间
      },
      dlgInfo: { // 弹框信息
        showDlg: false,
        type: ''
      }
    }
  },
  components: {
    DialogExport,
    MatchingId,
    ClientArea
  },
  mounted () {
    this.getTableList(this.Cmd, this.params)
    this.getApplySourceId()
    this.getStatus()
  },
  methods: {
    remoteMethod (query) {
      if (query !== '' && query.length > 1) {
        if (query) {
          this.loading = true
          setTimeout(() => {
            this.factoryId = []
            this.getFactoryId(query)
            this.loading = false
          }, 300)
        }
      }
    },
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
    // 改变在线状态
    changeOnline () {
      if (this.params.isOnline !== '1') {
        this.runType = []
      } else {
        this.runType = this.runType2
      }
    },
    // 创建账号
    createAccount () {
      sessionStorage.setItem('inType', 1)
      this.$router.push('/operations/RegUser')
    },
    // 已有账号查询
    searchAccount () {
      sessionStorage.setItem('inType', 1)
      this.$router.push('/operations/GetUser')
    },
    // 获取厂家名称
    getFactoryId (query) {
      this.$store.dispatch('a:device/selectFactoryByName', {facName: query}).then(
        res => {
          this.factoryId = res || []
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    // 获取申请来源
    getApplySourceId () {
      this.$store.dispatch('a:device/getResourceList', {}).then(
        res => {
          this.applySourceId = res || []
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    // 获取状态
    getStatus () {
      this.$store.dispatch('a:device/getStatusList', {}).then(
        res => {
          this.status = res || []
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    // 导出
    deviceExport (boxNo) {
      sessionStorage.setItem('exportBoxNo', boxNo)
      this.dlgInfo.showDlg = true
    },
    // 查询列表
    search () {
      // 参数缓存
      this.saveFilterParams(this.params, this.pageInfoReq.startPage)
      // 获取表单数据
      this.getTableList(this.Cmd, this.params)
    },
    // 获取日期
    getDateRange () {
      return {
        dateFrom: this.modelDateFrom ? tool.dateFormat(this.modelDateFrom, 'yyyy-MM-dd') : '',
        dateTo: this.modelDateTo ? tool.dateFormat(this.modelDateTo, 'yyyy-MM-dd') : ''
      }
    },
    searchTab () {
      // this.params.factoryId = this.$refs.client1.getSelectedOption().id
      if (this.$refs.dateRange) {
        this.params.beginDate = this.$refs.dateRange.getDateRange().dateFrom || ''
        this.params.endDate = this.$refs.dateRange.getDateRange().dateTo
      }
      this.pageInfoReq.page = 1
      this.pageNo = 1
      this.getTableList(this.Cmd, this.params)
    },
    // 详情
    reset (memberCode) {
      sessionStorage.setItem('memberCode', memberCode)
      sessionStorage.setItem('goToUpdate', 1)
      this.$router.push('/operations/Update')
      sessionStorage.setItem('backParams', JSON.stringify(this.params))
      this.saveFilterParams(this.params, this.pageInfoReq.page)
      sessionStorage.setItem('savePageStart', this.pageInfoReq.page)
    }
  }
}
</script>

<style lang="less" scoped>
  .matching-wrapper > label {
    width: 63px !important;
  }
  .reset-select-wrapper:nth-of-type(1){
    width: 350px;
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
  tbody {
    tr {
      td {
        padding-bottom: 3px;
        width: auto;
        height: 40px;
        text-align: center;
        color: #7E9EA5;
        vertical-align: top;
        &>div {
          padding-left: 1em;
          padding-right: 1em;
          height: 100%;
          vertical-align: middle;
          white-space: nowrap;
          line-height: 37px;
          border-left: solid 1px  #F4E9E9;
          border-top: solid 1px  #F4E9E9;
          border-bottom: solid 1px  #F4E9E9;
        }
        &:last-child>div {
          border-right: solid 1px #F4E9E9;
        }
      }
    }
  }
  .table-wrapper table tbody tr td > div {
    height: 100% !important;
  }
  .date-wrapper .ivu-input {
    width: 120px !important;
  }
  .date-picker-wrapper, .select-wrapper2 {
    width: 350px;
  }
</style>
