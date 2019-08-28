<!-- 财务管理-收款管理/弹框 -->
<template>
  <section class="dialog-wrapper">
    <div class="dialog">
      <div class="dialog-header">
        <span>机床关联历史</span>
        <span class="dlg-close"><img src="~@/assets/images/close.png" @click="cancel"></span>
        <!--<span class="dlg-close"><i class="iconfont close" @click="cancel"></i></span>-->
      </div>
      <div class="dialog-body">
        <!-- 表单展示 -->
        <section class="table-wrapper">
          <section class="list-wrapper custom-scroll scroll">
            <custom-table :thead="thead" :tbody="tbody" :scroll="true">
              <template slot="item" slot-scope="props">
                <td><div>{{props.item.serNo}}</div></td>
                <td><div>{{props.item.brandName}}</div></td>
                <td><div>{{props.item.mainTypeName}}</div></td>
                <td><div>{{props.item.typeName}}</div></td>
                <td><div>{{props.item.mtType}}</div></td>
                <td>
                   <div class="operations flex-center">
                     <div class="btn btn-detail" @click.stop="readRecord(props.item.serNo, props.item.iboxNo)">详情</div>
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
          <input type="number" v-model.trim="pageNo" v-on:blur="jumpTo" v-on:keyup.enter="jumpTo">
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
  </section>
</template>

<script>
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'
const thead = ['序列号', '系统型号', '大类名称', '小类名称', '机床类型', '操作']

export default {
  mixins: [mixinsTable, mixinsInfo],
  data () {
    return {
      pageNo: 1, // 页码
      thead: thead,
      tbody: [],
      pageInfo: {}
    }
  },
  props: ['dlgInfo', 'detailInfo', 'params2'],
  mounted () {
    this.getHistoryList()
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
        this.getHistoryList()
      }
    },
    changepage (index) {
      this.pageInfoReq.page = index
      this.pageNo = +index
      this.getHistoryList()
    },
    // 页码切换
    pageChange1 (page) {
      this.pageInfoReq.page = +page
      this.pageInfo.pageNo = +page
      this.getHistoryList()
    },
    readRecord (serNo, iboxNo) {
      this.dlgInfo.showDlg = false
      this.params2.onlyNo = serNo
      this.params2.boxNo = iboxNo
      this.detailInfo()
    },
    // 获取关联历史
    getHistoryList () {
      this.$store.dispatch('a:contract/getRList', {parameters: {...this.params2}, ...this.pageInfoReq}).then(
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
    cancel () {
      this.dlgInfo.showDlg = false
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/pages/device/DialogRelevance.less';
</style>
