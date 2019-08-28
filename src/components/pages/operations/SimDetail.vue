<template>
  <section class="app-detail-wrapper">
    <div class="page-title-wrapper">
      <span class="icon-title"></span>
      <span>SIM卡详情</span>
    </div>
    <!-- SMI卡信息 -->
    <div class="info-wrapper lines-split text-display">
      <div class="line title">SIM卡信息</div>
      <div class="base-info">
        <div>
          <p>激活时间：{{boxInfo.info.aliveTime}}</p>
          <p>接入号码：{{boxInfo.info.number}}</p>
        </div>
        <div>
          <p>卡状态：{{boxInfo.info.cardStatus |cardStatus}}</p>
          <p>ICCID：{{boxInfo.info.iccid}}</p>
        </div>
        <div>
          <p>断网状态：{{boxInfo.info.cutStatus |cutStatus}}</p>
        </div>
        <div>
          <p>用户名：{{boxInfo.info.userName}}</p>
        </div>
      </div>
      <div class="line title">流量信息</div>
      <div class="base-info">
        <div>
          <p class="title">基本信息</p>
          <div class="info-base">
            <span>已使用流量：{{boxInfo.flow.useFlow}}</span>
            <span>剩余流量：{{boxInfo.flow.lastFlow}}</span>
            <span>使用率：{{boxInfo.flow.precent}}</span>
            <span>使用时长：{{boxInfo.flow.durationCntCh}}</span>
          </div>
        </div>
      </div>
      <!-- 表单展示 -->
      <section class="table-wrapper" v-if="tbody.length">
        <section class="list-wrapper custom-scroll scroll">
          <custom-table :thead="thead" :tbody="tbody" :scroll="true">
            <template slot="item" slot-scope="props">
              <td><div>{{props.index + 1}}</div></td>
              <td><div>{{props.item.startTime}}</div></td>
              <td><div>{{props.item.durationCh}}</div></td>
              <td><div>{{props.item.bytesCnt}}</div></td>
              <td><div>{{props.item.ticketType}}</div></td>
            </template>
          </custom-table>
        </section>
        <div style="margin: 20px auto" class="pageStyle">
          <div class="left">
            <span>跳转至</span>
            <input type="number" v-model.trim="pageNo" v-on:blur="pageChange" v-on:keyup.enter="pageChange">
            <span>页</span>
          </div>
          <Page :total="pageInfo.totalCount" :page-size="10" :current="pageInfo.pageNo" @on-change="changepage" class="Page"/>
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
      </section>
      <div class="base-info" v-else>
        <div>
          <div class="nullDate">
            暂无列表数据
          </div>
        </div>
      </div>
      <div class="line title">定位信息
        <div class="lightColor" @click="resetBdMap()">获取定位信息</div></div>
      <div class="base-info">
        <div class="info-base">
          <span>定位时间：{{simLocation.localTime}}</span>
          <span>定位城市: {{simLocation.roamCity}}</span>
          <span>街道: {{simLocation.street}}</span>
          <span>定位坐标：{{simLocation.simPoint.lng}}, {{simLocation.simPoint.lat}}</span>
        </div>
      </div>
      <baidu-map class="bm-view" :ak="bdak" :center="center" :zoom="zoom" :scroll-wheel-zoom="false" :dragging="true" @moving="syncCenterAndZoom"
                 @moveend="syncCenterAndZoom"
                 @zoomend="syncCenterAndZoom" v-if="center.lng">
        <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT" type="BMAP_NAVIGATION_CONTROL_ZOOM"></bm-navigation>
        <bm-marker :position="simLocation.simPoint" :dragging="false" animation="BMAP_ANIMATION_BOUNCE"></bm-marker>
      </baidu-map>
      <div class="base-info" v-else>
        <div>
          <div class="nullDate">
            {{locationEmptyContent}}
          </div>
        </div>
      </div>

      <!-- 底部功能按钮 -->
      <section class="btns-group">
        <div class="btn btn-gray" @click="backForward">返回</div>
      </section>
    </div>
  </section>
</template>

<script>
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'
import BaiduMap from 'vue-baidu-map/components/map/Map.vue'
import BmMarker from 'vue-baidu-map/components/overlays/Marker.vue'
import BmNavigation from 'vue-baidu-map/components/controls/Navigation.vue'
import bdApi from '@/utils/bdapi'

const thead = ['序号', '开始时间', '使用时长', '消耗流量', '使用地']
const bdak = 'hf6qiVNK3tiTK7gj8eR6vYhDjQwm8qwc'
// const bdak = 'MSMUOOkTBiEZC4TGKlu36VZvBj2GIGfp'

export default {
  mixins: [mixinsTable, mixinsInfo],
  data () {
    return {
      locationEmptyContent: '',
      bdak: bdak,
      thead: thead,
      tbody: [],
      Cmd: 'a:operations/selectFlowList',
      detailParam: {
        number: ''
      },
      pageNo: 1,
      boxInfo: {
        info: {
          number: '', // 接入号码
          aliveTime: '', // 激活时间
          cardStatus: '', // 卡状态
          cutStatus: '', // 断网状态
          userName: '', // 用户名
          iccid: '' // iccid
        },
        flow: {
          useFlow: '', // 已使用流量
          precent: '', // 使用率
          lastFlow: '', // 剩余流量
          durationCntCh: '' // 使用时长
        }
      },
      simLocation: {
        localTime: '',
        roamCity: '',
        street: '',
        simPoint: {lng: 0, lat: 0}
      },
      center: {lng: 0, lat: 0},
      zoom: 15
    }
  },
  mounted () {
    this.detailParam.number = sessionStorage.getItem('number')
    this.detailInfo()
    this.getFlowList()
    this.getSimLocation()
  },
  components: {
    BaiduMap,
    BmMarker,
    BmNavigation
  },
  methods: {
    backForward () {
      this.$router.back()
      // this.$router.push('/operations/SIMcard')
    },
    detailInfo () {
      this.$store.dispatch('a:operations/selectSimInfo', this.detailParam).then(
        res => {
          this.boxInfo = res || {}
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    getFlowList () {
      this.getTableList(this.Cmd, this.detailParam)
    },
    getSimLocation () {
      this.$store.dispatch('a:operations/getSimAdress', this.detailParam).then(
        res => {
          if (res.iresult === -5 || res.iresult === '-5') {
            if (res.errorDetail === '130') {
              this.alert('定位失败，用户关机', 'error')
            } else if (res.errorDetail === '99' || res.errorDetail === '102' || res.errorDetail === '104') {
              this.alert('定位失败，基站信息获取失败', 'error')
            } else if (res.errorDetail === '245') {
              this.alert('被定位用户没有在定位平台开户', 'error')
            }
            this.locationEmptyContent = '暂无定位信息'
          } else {
            this.simLocation.localTime = res.localTime
            // this.simLocation.roamCity = res.roamCity
            this.simLocation.simPoint = { lng: res.longItuge, lat: res.latItude }
            this.center = { lng: res.longItuge, lat: res.latItude }
            if (res.longItuge === 0 || res.latItude === 0) {
              this.locationEmptyContent = '暂无定位信息'
            } else {
              this.locationEmptyContent = ''
            }
            this.queryBdLocation()
          }
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    pageChange () {
      let pages = Math.ceil(this.pageInfo.totalCount / 10)
      if (this.pageNo > pages || this.pageNo <= 0) {
        this.alert('请输入正确的页码！', 'error')
      } else {
        this.pageInfoReq.page = this.pageNo
        this.pageInfo.page = +this.pageNo
        this.getTableList(this.Cmd, this.detailParam)
      }
    },
    changepage (index) {
      this.pageInfoReq.page = index
      this.getTableList(this.Cmd, this.detailParam)
      this.pageNo = index
    },
    syncCenterAndZoom (e) {
      const {lng, lat} = e.target.getCenter()
      this.center.lng = lng
      this.center.lat = lat
      this.zoom = e.target.getZoom()
    },
    resetBdMap () {
      this.center.lng = this.simLocation.simPoint.lng
      this.center.lat = this.simLocation.simPoint.lat
      this.zoom = 15
    },
    queryBdLocation () {
      // this.$store.dispatch('a:operations/queryBdLocation', {lat: this.simLocation.simPoint.lat, lng: this.simLocation.simPoint.lng, ak: this.bdak}).then(
      //   res => {
      //     this.simLocation.roamCity = res.city
      //     this.simLocation.street = res.street
      //   },
      //   rej => {
      //     this.alert(rej.errorInfo, 'error')
      //   }
      // )
      const url = bdApi.bdLocationApi(this.simLocation.simPoint, this.bdak)
      this.$jsonp(url, {}).then(
        res => {
          if (res.status === 0) {
            this.simLocation.roamCity = res.result.addressComponent.city
            this.simLocation.street = res.result.formatted_address
            if (res.result.sematic_description !== '') {
              this.simLocation.street += ' ' + res.result.sematic_description
            }
          } else {
            console.log('queryLocation errorCode = ', res.status)
            this.alert('服务器开小差了~~', 'error')
          }
        }
      )
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/pages/device/Detail.less';
  .app-detail-wrapper .base-info div {
    width: 100%;
  }
  .info-base {
    margin-top: 15px;
    span {
      display: inline-block;
      margin-right: 100px;
    }
  }
 .bm-view {
   width: 96%;
   height: 900px;
   margin-top: 10px;
 }
 .lightColor {
    color: #269FD6;
    cursor: pointer;
 }
</style>
