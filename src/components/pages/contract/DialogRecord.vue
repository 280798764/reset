<!-- 财务管理-收款管理/弹框 -->
<template>
  <section class="dialog-wrapper">
    <div class="dialog">
      <div class="dialog-header">
        <span>派工记录</span>
        <span class="dlg-close"><img src="~@/assets/images/close.png" @click="cancel"></span>
        <!--<span class="dlg-close"><i class="iconfont close" @click="cancel"></i></span>-->
      </div>
      <div class="dialog-body">
        <!-- 表单展示 -->
        <section class="table-wrapper">
          <section class="list-wrapper custom-scroll scroll">
            <custom-table :thead="thead" :tbody="tbody" :scroll="true">
              <template slot="item" slot-scope="props">
                <td><div>{{props.item.sn}}</div></td>
                <td><div>{{props.item.dispatchTime}}</div></td>
                <td><div>{{props.item.finishTime}}</div></td>
                <td><div>{{props.item.engineerName}}</div></td>
                <td><div>{{props.item.sendType | deliveryServiceType}}</div></td>
                <td><div>{{props.item.mtNum}}</div></td>
                <td><div>{{props.item.status | dispatchingStatus}}</div></td>
                <td>
                   <div class="operations flex-center">
                     <div class="btn btn-detail" @click.stop="readRecord(props.item.requirementId, props.item.status, props.item.sendType)">验收查看</div>
                   </div>
                </td>
              </template>
            </custom-table>
          </section>
        </section>
      </div>
      <!--<pagination v-if="pageInfo.totalPageCount" :pageInfo="pageInfo" @pageChange="pageChange"></pagination>-->
      <div style="margin: 20px auto" class="pageStyle">
        <div class="left">
          <span>跳转至</span>
          <input type="text" v-model.trim="pageNo" v-on:blur="jumpTo" v-on:keyup.enter="jumpTo">
          <span>页</span>
        </div>
        <Page :total="pageInfo.totalCount" :page-size="10" :current="pageInfo.page" @on-change="changepage" class="Page"/>
        <div class="total-pages">
          <span>共</span>
          <span class="count">{{pageInfo.totalPageCount}}</span>
          <span>页</span>
        </div>
      </div>
      <div class="dialog-footer">
        <div class="btn btn-cancel wid-70px mr-15px" @click="cancel">取消</div>
      </div>
    </div>
    <dialog-Check v-if="dlgInfo3.showDlg" :dlgInfo3="dlgInfo3" @cancel="dlgInfo3.showDlg = false" :detailInfo="detailInfo"></dialog-Check>
  </section>
</template>

<script>
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'
import DialogCheck from './DialogCheck'
const thead = ['派工单号', '派工时间', '完成时间', '代理人', '派工服务类型', '设备数量', '派工状态', '操作']

export default {
  mixins: [mixinsTable, mixinsInfo],
  data () {
    return {
      params: {
        agreementNo: '' // 合同编号
      },
      pageNo: 1, // 页码
      thead: thead,
      tbody: [],
      pageInfo: {},
      dlgInfo3: { // 弹框信息
        showDlg: false,
        type: ''
      }
    }
  },
  props: ['dlgInfo', 'detailInfo'],
  components: {
    DialogCheck
  },
  mounted () {
    this.params.agreementNo = sessionStorage.getItem('agreementNo')
    this.getList()
  },
  methods: {
    // 验收查看
    readRecord (requirementId, status, sendType) {
      sessionStorage.setItem('requirementId', requirementId)
      sessionStorage.setItem('statusShow', status)
      sessionStorage.setItem('sendTypeIn', sendType)
      this.dlgInfo3.showDlg = true
    },
    getList () {
      this.$store.dispatch('a:contract/getWorkList', {parameters: {...this.params}, ...this.pageInfoReq}).then(
        res => {
          this.tbody = res.list || []
          // 把pageInfo封装成对象
          if (res) {
            for (let item in res) {
              if (!Array.isArray(item)) {
                this.pageInfo[item] = res[item]
              }
            }
          }
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
        this.getList()
      }
    },
    changepage (index) {
      this.pageInfoReq.page = index
      this.pageNo = +index
      this.getList()
    },
    // 页码切换
    pageChange1 (page) {
      this.pageInfoReq.page = +page
      this.pageInfo.pageNo = +page
      this.getList()
    },
    cancel () {
      this.dlgInfo.showDlg = false
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/pages/device/DialogRelevance.less';
  .dialog-wrapper .dialog {
    min-width: 1020px !important;
  }
</style>
