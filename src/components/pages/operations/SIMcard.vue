<template>
  <section>
    <div class="page-title-wrapper" >
      <span class="icon-title"></span>
      <span>SIM卡管理</span>
    </div>
    <!--过滤条件-->
    <section class="filter-wrapper" @keyup.enter="searchTab">
      <div class="filter-line resetLine">
        <label class="app-name-dev special-first">魔盒编号</label><input type="text" v-model.trim="params.boxNo" placeholder="请输入魔盒编号">
        <label class="app-name-dev special-first">接入号码</label><input type="text" v-model.trim="params.number" placeholder="请输入接入号码">
        <label class="app-name-dev special-first">使用权</label>
        <div class="select-wrapper select-wrapper2">
          <Row>
            <Col span="12" style="padding-right:10px; width: 348px">
            <Select
              v-model="params.userId"
              filterable clearable
              remote :remote-method="remoteMethod"
              :loading="loading">
              <Option v-for="(option, index) in userId" :value="option.id" :key="index">{{option.name}}</Option>
            </Select>
            </Col>
          </Row>
        </div>
        <label class="app-name-dev special-first">SIM卡状态</label>
        <div class="select-wrapper">
          <Select v-model="params.status" clearable>
            <Option v-for="(option, index) in simStatus" :value="option.id" :key="index">{{option.name}}</Option>
          </Select>
        </div>
        </div>
      <div class="filter-line resetLine">
        <label class="app-name-dev special-first">已使用流量</label>
        <input type="number" v-model.trim="params.minFlow" placeholder="请输入最小值">
        <p class="app-name-dev special-first p-padding">-</p>
        <input type="number" v-model.trim="params.maxFlow" placeholder="请输入最大值">
        <label class="app-name-dev special-first">所属群组</label>
        <div class="select-wrapper" style="width: 238px">
          <Select v-model="params.groupName" clearable>
            <Option v-for="(option, index) in belongGroup" :value="option.groupKey" :key="index">{{option.groupName}}</Option>
          </Select>
        </div>
        <div class="func-btns-wrapper search-reset">
          <div class="func-btn btn-search" @click="searchTab"><i class="iconfont icon-icon-btn-search"></i>查询</div>
        </div>
      </div>
    </section>
    <section class="func-btns-wrapper">
      <div class="func-btn btn-create" @click="imports('create')">批量导入</div>
      <div class="func-btn btn-create" @click="importsAll('create')">批量导出</div>
    </section >
    <!-- 表单展示 -->
    <section class="table-wrapper">
      <section class="list-wrapper custom-scroll scroll">
        <custom-table :thead="thead" :tbody="tbody" :scroll="true">
          <template slot="item" slot-scope="props">
            <td><div>{{props.item.boxNo}}</div></td>
            <td><div>{{props.item.number}}</div></td>
            <td><div>{{props.item.iccid}}</div></td>
            <!-- sim状态 -->
            <td><div>{{props.item.cardStatus |cardStatus}}</div></td>
            <td><div>{{props.item.userName}}</div></td>
            <!-- 当月用量 -->
            <td><div>{{props.item.useFlow}}M</div></td>
            <!-- 剩余流量 -->
            <td><div>{{props.item.lastFlow}}M</div></td>
            <!-- 断网状态 -->
            <td><div>{{props.item.cutStatus |cutStatus}}</div></td>
            <!-- 所属群组 -->
            <td><div>{{props.item.groupName}}</div></td>
            <td class="operations-td wid-100px">
              <div class="operations flex-center">
                <div class="btn btn-detail" @click="edit(props.item.iccid, props.item.id, props.item.number, props.item.boxNo, props.item.userName)">修改</div>
                <div class="btn btn-detail" @click="readDetail(props.item.number)">详情</div>
                <div class="btn btn-delete" @click="deleteFun(props.item.id)">删除</div>
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
    <dialog-SIM v-if="dlgInfo.showDlg" :dlgInfo="dlgInfo" :Cmd="Cmd" :params="params" :editParams="editParams" @cancel="dlgInfo.showDlg = false"></dialog-SIM>
  </section>
</template>

<script>
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'
import DialogSIM from './DialogSIM.vue'
import { DOMAIN } from '@/utils/config'
const thead = ['魔盒编号', '接入号码', 'ICCID', 'SIM状态', '使用权', '当月用量（MB）', '剩余流量（MB）', '断网状态', '所属群组', '操作']

export default {
  mixins: [mixinsTable, mixinsInfo],
  data () {
    return {
      loading: false,
      userId: [],
      belongGroup: [], // 所属群组
      simStatus: [], // sim卡状态
      Cmd: 'a:operations/selectSimList',
      pageNo: 1,
      thead: thead,
      tbody: [],
      params: {
        boxNo: '',
        userId: '',
        number: '',
        maxFlow: '', // 最大流量
        minFlow: '', // 最小流量
        groupName: '', // 所属群组
        status: '' // sim卡状态
      },
      dlgInfo: {
        showDlg: false,
        type: ''
      },
      deleteParams: {
        id: ''
      },
      editParams: {
        iccid: '',
        id: '',
        number: '',
        boxNo: '',
        userName: ''
      }
    }
  },
  components: {
    DialogSIM
  },
  mounted () {
    this.getList()
    this.getStatus()
    this.getGroupNames()
    this.getBaseInfo()
  },
  methods: {
    remoteMethod (query) {
      if (query !== '' && query.length > 1) {
        if (query) {
          this.loading = true
          setTimeout(() => {
            this.userId = []
            this.getUseId(query)
            this.loading = false
          }, 300)
        }
      }
    },
    // 详情
    readDetail (number) {
      sessionStorage.setItem('number', number)
      this.$router.push('/operations/SimDetail')
      sessionStorage.setItem('backParams', JSON.stringify(this.params))
      this.saveFilterParams(this.params, this.pageInfoReq.page)
      sessionStorage.setItem('savePageStart', this.pageInfoReq.page)
    },
    // 删除
    deleteFun (id) {
      this.deleteParams.id = id
      this.dlgInfo.showDlg = true
      this.dlgInfo.type = 'delete'
    },
    trueDelete () {
      this.$store.dispatch('a:operations/simDdelete', this.deleteParams).then(
        res => {
          this.alert('删除成功！', 'success')
          this.getTableList(this.Cmd, this.params)
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    edit (iccid, id, number, boxNo, userName) {
      this.editParams.iccid = iccid
      this.editParams.id = id
      this.editParams.number = number
      this.editParams.boxNo = boxNo
      this.editParams.userName = userName
      this.dlgInfo.showDlg = true
      this.dlgInfo.type = 'edit'
    },
    editFun () {
      this.$store.dispatch('a:operations/update', this.editParams).then(
        res => {
          this.alert('修改成功！', 'success')
          this.getTableList(this.Cmd, this.params)
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
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
    // 导入
    imports () {
      this.dlgInfo.showDlg = true
      this.dlgInfo.type = 'import'
    },
    // 导出
    importsAll () {
      window.location.href = `${DOMAIN.originExport}/exportSimMsg?userToken=${window.sessionStorage.getItem('userToken')}&&userId=`
    },
    searchTab () {
      this.pageInfoReq.page = 1
      this.pageNo = 1
      if ((this.params.maxFlow) < 0 || this.params.minFlow < 0) {
        this.alert('剩余流量值不能小于零！', 'error')
        return
      }
      if (this.params.maxFlow && Number(this.params.maxFlow) <= Number(this.params.minFlow)) {
        this.alert('剩余流量最小值输入错误！', 'error')
        return
      }
      this.getTableList(this.Cmd, this.params)
    },
    // 获取使用权
    getUseId (query) {
      this.$store.dispatch('a:device/selectFactoryByName', {facName: query}).then(
        res => {
          this.userId = res || []
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    // 获取状态列表
    getStatus () {
      this.$store.dispatch('a:operations/getCardStatusList', {}).then(
        res => {
          this.simStatus = res || []
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    // 获取所属群组列表
    getGroupNames () {
      this.$store.dispatch('a:operations/getGroupList', {}).then(
        res => {
          this.belongGroup = res || []
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
  .btn-detail {
    margin-right: 10px !important;
  }
  .resetLine {
    .ivu-row {
      width: 250px;
    }
    .ivu-col-span-12 {
      width: 100%;
    }
  }
  .p-padding {
    padding: 0 12px;
  }
  .date-picker-wrapper, .select-wrapper2 {
    width: 350px;
  }
</style>
