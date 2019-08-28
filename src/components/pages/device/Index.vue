<template>
  <section style="background-color: #eee;">
    <div class="page-title-wrapper" >
      <span class="icon-title"></span>
      <span>机床参数管理</span>
    </div>
    <!--过滤条件-->
    <section class="filter-wrapper" @keyup.enter="searchTab">
      <div class="filter-line">
        <label class="app-name-dev special-first">参数ID</label><input type="text" v-model.trim="params.paramId">
        <label class="app-name-dev special-first">参数名称</label><input type="text" v-model.trim="params.paramName">
        <label>设备参数集</label>
        <div class="select-wrapper">
          <Select v-model="params.paramVersion" clearable>
            <Option v-for="item in equTypeList" :value="item.id" :key="item.id">{{item.type}}</Option>
          </Select>
        </div>
        <label>参数类别</label>
        <div class="select-wrapper">
          <Select v-model="params.categoryId" clearable>
            <Option v-for="item in paramCategoryList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </div>
        <label class="app-name-dev special-first">设备参数名</label><input type="text" v-model.trim="params.name">
        <div class="func-btns-wrapper search-reset">
          <Checkbox v-model="params.paramIdExact">是否精确查询(参数ID)</Checkbox>
        </div>
        <div class="func-btns-wrapper search-reset">
          <div class="func-btn btn-search" @click="searchTab"><i class="iconfont icon-icon-btn-search"></i>查询</div>
        </div>
      </div>
    </section>
    <section class="func-btns-wrapper">
      <div class="func-btn btn-create" @click="add">新增</div>
    </section >
    <!-- 表单展示 -->
    <section class="table-wrapper">
      <section class="list-wrapper custom-scroll scroll">
        <custom-table :thead="thead" :tbody="tbody" :scroll="true">
          <template slot="item" slot-scope="props">
            <td><div>{{props.index + 1}}</div></td>
            <td><div>{{props.item.paramId}}</div></td>
            <td><div>{{props.item.paramName}}</div></td>
            <td><div>{{props.item.name}}</div></td>
            <td><div>{{props.item.paramVersion}}</div></td>
            <td><div>{{props.item.categoryName}}</div></td>
            <td><div>{{props.item.paramUnit}}</div></td>
            <td><div>{{props.item.defaultValue}}</div></td>
            <td><div>{{props.item.maxValue}}</div></td>
            <td><div>{{props.item.minValue}}</div></td>
            <td><div>{{props.item.memo}}</div></td>
            <td class="operations-td wid-100px">
              <div class="operations flex-center">
                <div class="btn btn-detail" @click.stop="readRecord(props.item.mtNo)">修改</div>
                <div class="btn btn-detail" @click="deviceExport(props.item.mtNo)">删除</div>
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
          <Page :total="pageInfo.total" :page-size="10" :current="pageInfo.pageNo" @on-change="changepage" class="Page"/>
          <div class="total-pages">
            <span>共</span>
            <span class="count">{{pageInfo.totalPageCount}}</span>
            <span>页</span>
          </div>
        </div>
        <!--<pagination v-if="pageInfo.totalPageCount" :pageInfo="pageInfo" @pageChange="pageChange"></pagination>-->
      </section>
    </section>
    <dialog-add v-if="dlgInfo.showDlg" :dlgInfo="dlgInfo" @cancel="dlgInfo.showDlg = false"></dialog-add>
  </section>
</template>

<script>
import DialogAdd from './DialogAdd'
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'
const thead = ['序号', '参数ID', '参数名称', '设备参数名', '设备参数集', '参数类别', '单位', '默认值', '最大值', '最小值', '备注', '操作']

export default {
  mixins: [mixinsTable, mixinsInfo],
  data () {
    return {
      pageNo: 1, // 页码
      Cmd: 'a:device/find',
      equTypeList: [], // 设备参数集
      paramCategoryList: [], // 参数类别
      thead: thead, // 表格头
      tbody: [], // 表格内容
      params: {
        categoryId: '',
        name: '',
        paramId: '',
        paramIdExact: false,
        paramName: '',
        paramVersion: ''
      },
      dlgInfo: { // 弹框信息
        showDlg: false,
        type: ''
      },
      boxMainTypeList: [] // 魔盒大类列表
    }
  },
  components: {
    DialogAdd
  },
  mounted () {
    this.getTableList(this.Cmd, this.params)
    this.getAll()
    this.category()
  },
  methods: {
    add () {
      this.dlgInfo.showDlg = true
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
    // 改变获取方式
    changeUseType () {
      if (this.params.useType === 1) {
        this.rentType = []
        this.params.rentType = ''
      } else {
        this.rentType = this.rentType2
      }
    },
    searchTab () {
      // this.params.propertyId = this.$refs.client1.getSelectedOption().id
      // this.params.useId = this.$refs.client2.getSelectedOption().id
      this.pageInfoReq.page = 1
      this.pageNo = 1
      this.getTableList(this.Cmd, this.params)
    },
    /* 获取设备参数集 */
    getAll () {
      this.$store.dispatch('a:device/getAll', {}).then(
        res => {
          this.equTypeList = res.items || []
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    /* 获取参数类别 */
    category () {
      this.$store.dispatch('a:device/category/getAll', {}).then(
        res => {
          this.paramCategoryList = res.items || []
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
  .date-picker-wrapper, .select-wrapper2 {
    width: 350px;
  }
  .tab-wrapper {
    width: 100%;
    display: flex;
    margin-top: 10px;
    .tab-col {
      height: 110px;
      flex: 1;
      background-color: #fff;
      border: 1px solid rgba(121, 121, 121, 1);
      margin-right: 3px;
      .in-tab {
        display: flex;
        height: 110px;
        .col-5 {
          flex: 5;
          height: 110px;
        }
        .col-2 {
          flex: 2;
          height: 110px;
        }
        .col-1 {
          flex: 1;
          height: 110px;
        }
      }
      p {
        height: 50px;
        line-height: 50px;
      }
      p,h2 {
        text-align: center;
      }
      .long-txt {
        min-width: 81px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .txt-line {
        height: 36px;
        line-height: 36px;
      }
      .txt-line-type {
        float: left;
        width: 33%;
        height: 36px;
        line-height: 36px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .wrap-line {
        position: relative;
        .position-line {
          position: absolute;
          width: 0;
          height: 60px;
          border-left: 1px solid rgba(121, 121, 121, 1);
          left: 0;
          top: 25px;
        }
      }
    }
  }
</style>
