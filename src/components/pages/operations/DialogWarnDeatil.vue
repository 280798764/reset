<!-- 财务管理-收款管理/弹框 -->
<template>
  <section class="dialog-wrapper">
    <div class="dialog">
      <div class="dialog-header">
        <span>详情</span>
        <span class="dlg-close"><img src="~@/assets/images/close.png" @click="cancel"></span>
      </div>
      <div class="dialog-body">
        <!-- 表单展示 -->
        <section class="table-wrapper">
          <section class="list-wrapper custom-scroll scroll">
            <custom-table :thead="thead" :tbody="tbody" :scroll="true">
              <template slot="item" slot-scope="props">
                <td><div>{{props.index + 1}}</div></td>
                <td><div>{{props.item.boxNo}}</div></td>
                <td><div>{{props.item.number}}</div></td>
                <td><div>{{props.item.iccid}}</div></td>
                <td><div>{{props.item.facName}}</div></td>
              </template>
            </custom-table>
          </section>
        </section>
      </div>
      <!--<pagination v-if="pageInfo.totalPageCount" :pageInfo="pageInfo" @pageChange="pageChange"></pagination>-->
      <div style="margin: 20px auto" class="pageStyle">
        <div class="left">
          <span>跳转至</span>
          <input type="number" v-model.trim="pageNo" v-on:blur="jumpTo" v-on:keyup.enter="jumpTo">
          <span>页</span>
        </div>
        <Page :total="pageInfo.totalCount" :page-size="10" :current="pageInfo.page" @on-change="changepage" class="Page"/>
        <div class="total-pages">
          <span>共</span>
          <span class="count">{{pageInfo.totalPageCount}}</span>
          <span>页</span>
        </div>
        <div class="total-pages">
          <span>共</span>
          <span class="count">{{pageInfo.totalCount}}</span>
          <span>条</span>
        </div>
      </div>
      <div class="dialog-footer">
        <div class="btn btn-cancel wid-70px mr-15px" @click="cancel">返回</div>
      </div>
    </div>
  </section>
</template>

<script>
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'
const thead = ['序号', '魔盒编号', '接入号码', 'ICCID', '使用权']

export default {
  mixins: [mixinsTable, mixinsInfo],
  data () {
    return {
      totalPageCount: '',
      pageNo: 1, // 页码
      thead: thead,
      tbody: [],
      pageInfo: {}
    }
  },
  props: ['dlgInfo'],
  mounted () {
    this.getList()
  },
  methods: {
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
    getList () {
      let date = sessionStorage.getItem('detailDate')
      this.$store.dispatch('a:operations/selectFailList', {parameters: {startDate: date}, ...this.pageInfoReq}).then(
        res => {
          this.tbody = res.list || []
          if (res) {
            for (let item in res) {
              if (!Array.isArray(item)) {
                this.pageInfo[item] = res[item]
              }
            }
            if (res.pageNo) {
              this.pageInfo.totalPageCount = res.totalPageCount
              this.pageInfo.hasPrePage = res.hasPrePage
            }
          }
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
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
    width: 1000px !important;
  }
</style>
