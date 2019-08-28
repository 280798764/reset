<template>
  <section>
    <div class="page-title-wrapper" >
      <span class="icon-title"></span>
      <span>流量池管理</span>
    </div>
    <div class="filter-wrapper">
      <div class="filter-line resetLine">
        <label class="app-name-dev special-first">套餐名称：</label><span>{{pool.poolName}}</span>
      <!--  <label class="app-name-dev special-first">ICCID：</label><span>8986031743206431466</span>
        <label class="app-name-dev special-first">接入号码：</label><span>1064957932879</span>-->
        <label class="app-name-dev special-first">账期：</label><span>{{date}}</span>
        <label>账期选择</label>
        <div class="select-wrapper">
          <Select v-model="params.month" clearable>
            <Option v-for="item in monthList" :value="item.id" :key="item.id">{{item.name}}</Option>
          </Select>
        </div>
        <div class="func-btns-wrapper search-reset">
          <div class="func-btn btn-search" @click="getList"><i class="iconfont icon-icon-btn-search"></i>查询</div>
        </div>
      </div>
    </div>
    <div class="tabWrapper">
      <div>
        <p>开卡数量</p>
        <h1>{{pool.simTotal}}</h1>
      </div>
      <div>
        <p>套餐总流量</p>
        <h1>{{pool.canUsed}}MB</h1>
      </div>
      <div>
        <p>已使用量</p>
        <h1>{{pool. used}}MB</h1>
      </div>
      <div>
        <p>使用率</p>
        <h1>{{pool.flowPrecent}}</h1>
      </div>
    </div>
    <section class="func-btns-wrapper">
      <div class="func-btn btn-create" @click="imports('create')">批量导出</div>
    </section >
    <!-- 表单展示 -->
    <section class="table-wrapper">
      <section class="list-wrapper custom-scroll scroll">
        <custom-table :thead="thead" :tbody="tbody" :scroll="true">
          <template slot="item" slot-scope="props">
            <td><div>{{props.item.startDate}}</div></td>
            <td><div>{{props.item.total}}M</div></td>
            <td><div>{{props.item.poolLeft}}M</div></td>
            <td><div>{{props.item.flowPrecent}}</div></td>
            <td><div>{{props.item.inlineCount}}</div></td>
            <td><div>{{props.item.simTotal}}</div></td>
            <td><div>{{props.item.simPrecent}}</div></td>
            <td><div>{{props.item.feeStartTime}}</div></td>
            <td><div>{{props.item.feeEndTime}}</div></td>
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
      </section>
    </section>
  </section>
</template>

<script>
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'
import { DOMAIN } from '@/utils/config'
const thead = ['日期', '消耗流量', '剩余流量', '当日使用率', '在线卡数', 'SIM卡数量', 'SIM卡使用率', '计费开始时间', '计费结束时间']
export default {
  mixins: [mixinsTable, mixinsInfo],
  data () {
    return {
      Cmd: 'a:operations/getList',
      pageNo: 1,
      tbody: [],
      thead: thead,
      params: {
        month: ''
      },
      pool: {}, // 统计
      resInfo: {
      },
      date: '',
      pageInfo: {}
    }
  },
  mounted () {
    this.selectLastPool()
    this.getList()
  },
  created () {
    let month = (new Date().getMonth() + 1) > 10 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)
    this.params.month = new Date().getFullYear() + '-' + month
    this.date = new Date().getFullYear() + '-' + month
  },
  methods: {
    selectLastPool () {
      this.$store.dispatch('a:operations/selectLastPool', {}).then(
        res => {
          this.pool = res || {}
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    getList () {
      if (!this.params.month) {
        this.alert('账期选择不能为空！')
        return
      }
      if (this.params.month > this.date) {
        this.alert('账期选择不能超过当前月！')
        return
      }
      this.getTableList(this.Cmd, this.params)
    },
    imports () {
      window.location.href = `${DOMAIN.originExport}/exportPool?userToken=${window.sessionStorage.getItem('userToken')}&&month=${this.params.month}`
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
  .tabWrapper {
    padding-top: 10px;
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
</style>
