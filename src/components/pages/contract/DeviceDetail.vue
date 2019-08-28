<template>
  <section class="app-detail-wrapper">
    <div class="page-title-wrapper">
      <span class="icon-title"></span>
      <span>设备详情</span>
    </div>
    <!-- 基本信息 -->
    <div class="info-wrapper lines-split text-display">
      <div class="line title">基本信息</div>
      <div class="base-info">
        <div>
          <p>序列号：{{boxInfo.mtNo}}</p>
          <p>魔盒大类：{{boxInfo.mainTypeName}}</p>
          <p>魔盒小类：{{boxInfo.typeName}}</p>
          <p>获取方式：{{boxInfo.useType | useType}}</p>
        </div>
        <div>
          <p>MAC：{{boxInfo.mac}}</p>
          <p>U KEY：{{boxInfo.uKey}}</p>
          <p>AGENT KEY：{{boxInfo.agentKey}}</p>
        </div>
        <div>
          <p>联网状态：{{boxInfo.isOnline | isOnline}}</p>
          <p>业务状态：{{boxInfo.actName}}</p>
          <p>是否上线：{{boxInfo.imeOnline | onlineIs}}</p>

        </div>
        <div class="mall-box">
          <p>所有权：{{boxInfo.facPropertyName}}</p>
          <p>使用权：{{boxInfo.facUseName}}</p>
          <p>运行模式：{{boxInfo.runType}}</p>
        </div>
      </div>
    </div>
    <!-- 关联机床信息 -->
    <div class="info-wrapper lines-split text-display">
      <div class="line title">
        <span>关联机床信息</span>
        <span class="heightColor" @click="history(boxInfo.mtNo, mtInfo.serNo)">关联历史</span>
      </div>
      <div>
        <p class="inter-titie">基本信息</p>
        <div class="base-info inter">
          <div>
            <p>机床序列号：{{mtInfo.serNo}}</p>
            <p>机床品牌：{{mtInfo.facBrand}}</p>
            <p>采购年份：{{mtInfo.buyYear}}</p>
          </div>
          <div>
            <p>系统型号：{{mtInfo.brand === '03' ? 'SIEMENS' : mtInfo.brand === '04'? 'FANUC' : ''}}</p>
            <!--<p>机床类型：{{mtInfo.mtType}}</p>-->
            <p>机床大类：{{mtInfo.mainMtTypeName}}</p>
          </div>
          <div>
            <p>系统大类：{{mtInfo.mainTypeName}}</p>
            <p>机床小类：{{mtInfo.mtTypeName}}</p>
          </div>
          <div>
            <p>系统小类：{{mtInfo.typeName}}</p>
            <p>有无内冷：{{mtInfo.insideCold === '1' ? '有' : mtInfo.insideCold === '0' ? '无' : '' }}</p>
          </div>
        </div>
        <p class="inter-titie">刀柄类型</p>
        <div class="base-info inter">
          <div>{{mtInfo.knifeType}}</div>
        </div>
        <p class="inter-titie">主轴参数</p>
        <div class="base-info inter">
          <div>
            <p>主轴功率：{{mtInfo.mainPower}} <span v-if="mtInfo.mainPower">KW</span></p>
          </div>
          <div>
            <p>最高转速：{{mtInfo.maxSpeed}} <span v-if="mtInfo.maxSpeed">r/min</span></p>
          </div>
        </div>
        <p class="inter-titie">进给轴参数</p>
        <!-- 表单展示 -->
        <section class="table-wrapper" v-if="tbody.length">
          <section class="list-wrapper custom-scroll scroll">
            <custom-table :thead="thead" :tbody="tbody" :scroll="true">
              <template slot="item" slot-scope="props">
                <td><div>{{props.item.axis}}</div></td>
                <td><div>{{props.item.maxStroke}}</div></td>
                <td><div>{{props.item.feedPower}}</div></td>
              </template>
            </custom-table>
          </section>
        </section>
        <div class="nullDate" v-else>
          暂无数据
        </div>
      </div>
    </div>
    <div class="info-wrapper lines-split text-display">
      <div class="line title">
        <span>应用信息</span>
      </div>
      <section class="table-wrapper" v-if="tbody2.length">
        <section class="list-wrapper custom-scroll scroll">
          <custom-table :thead="thead2" :tbody="tbody2" :scroll="true">
            <template slot="item" slot-scope="props">
              <td><div>{{props.item.appName}}</div></td>
              <td><div>{{props.item.appNameEn}}</div></td>
              <td><div>{{props.item.version}}</div></td>
              <td><div>{{props.item.uninstall === '1' ? '基础服务' : props.item.uninstall === '0' ? '平台应用' : ''}}</div></td>
            </template>
          </custom-table>
        </section>
      </section>
      <div class="nullDate" v-else>
        暂无数据
      </div>
    </div>
    <!-- 底部功能按钮 -->
    <section class="btns-group">
      <div class="btn btn-gray" @click="backForward">返回</div>
    </section>
    <dialog-Relevance v-if="dlgInfo.showDlg" :dlgInfo="dlgInfo" @cancel="dlgInfo.showDlg = false" :detailInfo="detailInfo" :params2="params2"></dialog-Relevance>
  </section>
</template>

<script>
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'
import DialogRelevance from './DialogRelevance'
const thead = ['进给轴名称', '最大行程（mm）', '进给功率（KW）']
const thead2 = ['中文名', '英文名', '版本号', '类型']

export default {
  mixins: [mixinsInfo, mixinsTable],
  data () {
    return {
      initFlag: '', // 进入详情时的标识
      thead: thead,
      thead2: thead2,
      tbody2: [], // 基本信息
      tbody: [], // 进给轴参数
      params2: {
        boxNo: '', // 盒子序列号 iboxNo
        onlyNo: '' // 详情不填， 关联填 serNo
      },
      boxInfo: {},
      mtInfo: {}, // 设备信息
      dlgInfo: { // 弹框信息
        showDlg: false,
        type: ''
      }
    }
  },
  components: {
    DialogRelevance
  },
  mounted () {
    this.params2.onlyNo = ''
    this.params2.boxNo = sessionStorage.getItem('boxNoDevice')
    this.detailInfo()
  },
  methods: {
    // 关联历史
    history (mtNo, serNo) {
      this.dlgInfo.showDlg = true
      sessionStorage.setItem('onlyNo', mtNo)
      sessionStorage.setItem('serNo', serNo)
    },
    // 返回
    backForward () {
      this.$router.push('/contract/detail')
    },
    detailInfo () {
      this.$store.dispatch('a:contract/getBoxByNo', this.params2).then(
        res => {
          this.boxInfo = res.boxInfo || {}
          this.mtInfo = res.mtInfo || {}
          this.tbody = res.mtList || []
          this.tbody2 = res.appList || []
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
</style>
