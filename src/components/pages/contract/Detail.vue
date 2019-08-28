<template>
  <section class="app-detail-wrapper">
    <div class="page-title-wrapper">
      <span class="icon-title"></span>
      <span>合同详情</span>
    </div>
    <!-- 基本信息 -->
    <div class="info-wrapper lines-split text-display">
      <!--<div class="line title">基本信息</div>-->
      <div class="base-info reset-info">
        <div>
          <p :title="boxInfo.agreementNo">合同编号：{{boxInfo.agreementNo}}</p>
          <p :title="boxInfo.customerServiceName">联系人：{{boxInfo.customerServiceName}}</p>
          <p :title="boxInfo.effectDate">生效时间：{{boxInfo.effectDate}}</p>
          <p :title="boxInfo.endDate">到期时间：{{boxInfo.endDate}}</p>
        </div>
        <div>
          <p :title="boxInfo.companyName">客户名称：{{boxInfo.companyName}}</p>
          <p :title="boxInfo.customerServiceTelephone">联系方式：{{boxInfo.customerServiceTelephone}}</p>
          <p :title="boxInfo.agreementTypeName">合同类型：{{boxInfo.agreementTypeName}}</p>
          <p :title="boxInfo.agreementStatusName">合同状态：{{boxInfo.agreementStatusName}}</p>
        </div>
        <div>
          <p :title="boxInfo.installationAddress">设备实施地址：{{boxInfo.installationAddress}}</p>
          <p :title="boxInfo.provinceName">所在地：{{boxInfo.provinceName}}</p>
          <p :title="boxInfo.implementStatusName">设备实施状态：{{boxInfo.implementStatusName}}</p>
        </div>
      </div>
    </div>
    <section class="func-btns-wrapper">
     <div class="num-wrap">
       <span>设备总数量：{{boxInfo.boxChargeCount}}</span>
       <span>已实施数量：{{boxInfo.insertMtCount}}</span>
       <span>待回收设备数量：{{boxInfo.recoverDeviceCount}}</span>
       <span>已回收设备数量：{{boxInfo.deleteMtCount}}</span>
     </div>
      <div class="func-btn btn-create" @click="dispatching(boxInfo.agreementNo, boxInfo.companyName, boxInfo.customerServiceName, boxInfo.customerServiceTelephone, boxInfo.nodeId)">去派工</div>
    </section >
    <!-- 表单展示 -->
    <section class="table-wrapper">
      <section class="list-wrapper custom-scroll scroll">
        <custom-table :thead="thead" :tbody="tbody" :scroll="true">
          <template slot="item" slot-scope="props">
            <td><div>{{props.item.mtNo}}</div></td>
            <td><div>{{props.item.mainTypeName}}</div></td>
            <td><div>{{props.item.typeName}}</div></td>
            <td><div>{{props.item.boxMtNo}}</div></td>
            <td><div>{{props.item.facPropertyName}}</div></td>
            <td><div>{{props.item.facUseName}}</div></td>
            <td><div>{{props.item.imeOnline === '1'? '是' : props.item.isOnline === '0' ? '否' : ''}}</div></td>
            <td><div>{{props.item.useType | useType}}</div></td>
            <td><div>{{props.item.isOnline | isOnline}}</div></td>
            <td><div>{{props.item.actName}}</div></td>
            <td><div>{{props.item.runType}}</div></td>
            <td><div>{{props.item.appCount}}</div></td>
            <td class="operations-td wid-100px">
              <div class="operations flex-center">
                <div class="btn btn-detail" @click.stop="readDetail(props.item.mtNo)">详情</div>
                <!--<div class="btn btn-detail" @click.stop="readHistory(props.item.mtNo)">派工历史</div>-->
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
    <!-- 底部功能按钮 -->
    <section class="btns-group">
      <div class="btn btn-gray" @click="backForward">返回</div>
    </section>
    <dialog-History v-if="dlgInfo.showDlg" :dlgInfo="dlgInfo" @cancel="dlgInfo.showDlg = false" :detailInfo="detailInfo" :params2="params2"></dialog-History>
    <dialog-Dispatching v-if="dlgInfo2.showDlg" :dlgInfo="dlgInfo2" @cancel="dlgInfo.showDlg = false" :detailInfo="detailInfo" :info="info" :params2="params2"></dialog-Dispatching>
  </section>
</template>

<script>
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'
import DialogHistory from './DialogHistory'
import DialogDispatching from './DialogDispatching'
const thead = ['魔盒编号', '魔盒大类', '魔盒小类', '关联机床编号', '所有权', '使用权', '是否上线', '获取方式', '联网状态', '业务状态', '运行模式', 'APP数量', '操作']

export default {
  mixins: [mixinsInfo, mixinsTable],
  data () {
    return {
      pageNo: 1, // 页码
      initFlag: '', // 进入详情时的标识
      thead: thead,
      tbody: [],
      params2: {
        agreementNo: '', // 合同编号
        nodeId: '' // 合同编号
      },
      boxInfo: {},
      mtInfo: {}, // 设备信息
      dlgInfo: { // 弹框信息
        showDlg: false,
        type: ''
      },
      dlgInfo2: { // 弹框信息
        showDlg: false,
        type: ''
      },
      info: {} // 带入弹框的数据
    }
  },
  mounted () {
    this.params2.agreementNo = sessionStorage.getItem('agreementNoDetail')
    this.detailInfo()
  },
  components: {
    DialogHistory,
    DialogDispatching
  },
  methods: {
    jumpTo () {
      this.pageChange()
    },
    changepage (index) {
      this.pageInfoReq.page = index
      this.pageNo = +index
      this.getDeviceList()
    },
    // 页码切换
    pageChange () {
      let pages = Math.ceil(this.pageInfo.totalCount / 10)
      if (this.pageNo > pages || this.pageNo <= 0) {
        this.alert('请输入正确的页码！', 'error')
      } else {
        this.pageInfoReq.page = this.pageNo
        this.pageInfo.page = +this.pageNo
        this.getDeviceList()
      }
    },
    // 去派工
    dispatching (agreementNo, companyName, customerServiceName, customerServiceTelephone, nodeId) {
      this.info.agreementNo = agreementNo
      this.info.companyName = companyName
      this.info.customerServiceName = customerServiceName
      this.info.customerServiceTelephone = customerServiceTelephone
      this.info.nodeId = nodeId
      this.dlgInfo2.showDlg = true
      sessionStorage.setItem('detailInfo', JSON.stringify(this.boxInfo))
    },
    // 详情
    readDetail (mtNo) {
      sessionStorage.setItem('boxNoDevice', mtNo)
      this.$router.push('/contract/DeviceDetail')
    },
    // 派工历史
    readHistory (mtNo) {
      this.dlgInfo.showDlg = true
      sessionStorage.setItem('mtNo', mtNo)
    },
    // 关联历史
    history (mtNo, serNo) {
      this.dlgInfo.showDlg = true
      sessionStorage.setItem('onlyNo', mtNo)
      sessionStorage.setItem('serNo', serNo)
    },
    // 返回
    backForward () {
      this.$router.push('/contract/index')
    },
    detailInfo () {
      this.$store.dispatch('a:contract/getContract', this.params2).then(
        res => {
          this.boxInfo = res || {}
          this.params2.nodeId = res.nodeId
          this.getDeviceList()
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    getDeviceList () {
      this.$store.dispatch('a:contract/getAgreementList', {parameters: {...this.params2}, ...this.pageInfoReq}).then(
        res => {
          this.tbody = res.list || []
          for (let item in res) {
            if (!Array.isArray(item)) {
              this.pageInfo[item] = res[item]
            }
          }
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
  @import '~@/assets/styles/pages/device/Detail.less';
  .list-wrapper,.table-wrapper {
    min-height: 0 !important;
  }
  .func-btns-wrapper {
    position: relative;
  }
  .num-wrap {
    position: absolute;
    left: 25px;
    span {
      margin-right: 50px;
    }
  }
  .app-detail-wrapper .reset-info div {
    min-width: 33.33%;
    p {
      width: 100%;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
</style>
