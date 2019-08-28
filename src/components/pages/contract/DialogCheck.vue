<!-- 财务管理-收款管理/弹框 -->
<template>
  <section class="dialog-wrapper">
    <div class="dialog">
      <div class="dialog-header">
        <span>派工服务验收</span>
        <span class="dlg-close"><img src="~@/assets/images/close.png" @click="cancel"></span>
      </div>
      <!--过滤条件-->
      <section class="filter-wrapper" @keyup.enter="searchTab">
        <div class="filter-line">
          <label class="app-name-dev">验收类型：</label><span>{{pageInfo.sendType | deliveryServiceType}}</span>
          <label class="app-name-dev special-first"><i class="require">*</i>验收设备数量：</label>
          <input type="number" v-model.trim="pageInfo.acceptanceNum">
          <span class="text">台</span>
        </div>
      </section>
      <div class="dialog-footer">
        <div class="btn btn-cancel wid-70px mr-15px" @click="cancel">取消</div>
        <div v-if="statusShow === '30'" class="btn btn-sure wid-70px mr-15px" @click="save">确定</div>
      </div>
    </div>
  </section>
</template>

<script>
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'

export default {
  mixins: [mixinsTable, mixinsInfo],
  data () {
    return {
      statusShow: '', // 判断是否显示确认按钮
      paramsCheck: {
        requirementId: '',
        acceptanceNum: '',
        agreementNo: '', // 合同编号
        sendType: ''// 派工类型
      },
      pageInfo: {}
    }
  },
  props: ['dlgInfo3', 'detailInfo', 'info'],
  mounted () {
    this.statusShow = sessionStorage.getItem('statusShow')
    this.paramsCheck.requirementId = sessionStorage.getItem('requirementId')
    this.getInfo()
  },
  methods: {
    // 获取派工地址
    getInfo () {
      this.$store.dispatch('a:contract/selectAcceptanceNum', this.paramsCheck).then(
        res => {
          this.pageInfo = res || {}
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    // 创建派工单
    save () {
      if (!this.pageInfo.acceptanceNum) {
        this.alert('验收设备数量不能为空！', 'error')
        return
      }
      this.paramsCheck.acceptanceNum = this.pageInfo.acceptanceNum
      this.paramsCheck.agreementNo = sessionStorage.getItem('InAgreementNo')
      this.paramsCheck.sendType = sessionStorage.getItem('sendTypeIn')
      this.$store.dispatch('a:contract/updateAcceptanceNum', this.paramsCheck).then(
        res => {
          this.alert('修改成功！', 'success')
          this.dlgInfo3.showDlg = false
          // this.dlgInfo.showDlg = false
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    cancel () {
      this.dlgInfo3.showDlg = false
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/pages/device/DialogRelevance.less';
  /*.require {
    color: red;
    margin-right: 3px;
    font-style: normal;
  }
  .description-wrap div:nth-of-type(1) {
    margin: 5px 0;
  }
  .mall {
    width: 40px !important;
  }
  .leftLabe1 {
    margin-left: 22px !important;
  }*/
  .dialog-wrapper .dialog {
    min-width: 600px !important;
  }
  .require {
    color: red;
    margin-right: 3px;
    font-style: normal;
  }
  .special-first {
    margin-left: 100px;
  }
  .text {
    margin-left: 10px;
  }
</style>
