<!-- 财务管理-收款管理/弹框 -->
<template>
  <section class="dialog-wrapper">
    <div class="dialog">
      <div class="dialog-header">
        <span>创建派工需求单</span>
        <span class="dlg-close"><img src="~@/assets/images/close.png" @click="cancel"></span>
        <!--<span class="dlg-close"><i class="iconfont close" @click="cancel"></i></span>-->
      </div>
      <!--过滤条件-->
      <section class="filter-wrapper" @keyup.enter="searchTab">
        <div class="filter-line">
          <label class="app-name-dev special-first">合同编号：</label><span class=" reset-wid" :title="info.agreementNo">{{info.agreementNo}}</span>
          <label class="app-name-dev special-first">客户名称：</label><span class="reset-wid" :title="info.companyName">{{info.companyName}}</span>
          <label class="app-name-dev special-first"><i class="require">*</i>联系人：</label><input type="text" v-model="createParams.contact">
          <label class="app-name-dev special-first"><i class="require">*</i>联系电话：</label><input type="text" v-model="createParams.contactPhone">
        </div>
        <div class="filter-line">
          <label><i class="require">*</i>派工类型</label>
          <div class="select-wrapper">
            <Select v-model="createParams.sendType" clearable @on-change="typeSend">
              <Option v-for="item in sendTypeList" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          </div>
        </div>
        <div class="filter-line">
          <label class="leftLabe1"><i class="require">*</i>派工地址：省</label>
          <div class="select-wrapper">
            <Select v-model="createParams.provinceId" clearable @on-change="getPrefecture">
              <Option v-for="item in provinceList" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          </div>
          <label class="mall"><i class="require">*</i>市</label>
          <div class="select-wrapper">
            <Select v-model="createParams.prefectureId" clearable @on-change="getCounty">
              <Option v-for="item in prefectureList" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          </div>
          <label class="mall"><i class="require">*</i>区县</label>
          <div class="select-wrapper">
            <Select v-model="createParams.countyId" clearable>
              <Option v-for="item in countyList" :value="item.id" :key="item.id">{{item.name}}</Option>
            </Select>
          </div>
          <label class="mall"><i class="require">*</i>地址</label><input type="text" v-model="createParams.address">
        </div>
        <div  class="filter-line">
          <label class="app-name-dev special-first"><i class="require">*</i>设备数量</label><input type="number" v-model.trim="createParams.mtNum">
        </div>
        <div class="description-wrap">
          <div><i class="require">*</i>备注：</div>
          <div>
            <textarea name="" id="" cols="126" rows="7" v-model="createParams.description"></textarea>
          </div>
        </div>
      </section>
      <div class="dialog-footer">
        <div class="btn btn-cancel wid-70px mr-15px" @click="cancel">取消</div>
        <div class="btn btn-sure wid-70px mr-15px" @click="save">确定</div>
      </div>
    </div>
  </section>
</template>

<script>
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'
import tool from '@/utils/tool'

export default {
  mixins: [mixinsTable, mixinsInfo],
  data () {
    return {
      pageNo: 1, // 页码
      pageInfo: {},
      createParams: {
        address: '', // 详细地址
        companyName: '', // 客户名称
        contact: '', // 联系人
        contactPhone: '', // 联系电话
        countryId: '1', // 国家ID
        countyId: '', // 县ID
        description: '', // 描述
        mtNum: '', // 合同设备总数量
        nodeId: '', // 工厂ID
        orderNo: '', // 合同编号
        prefectureId: '', // 市ID
        provinceId: '', // 省ID
        sendType: '' // 派工类型
      },
      adress: {
        level: '1', // 层级（0国家,1省,2市,3区）
        parentId: '1' // 父节点ID，查level=0时传2
      },
      sendTypeList: [
        {id: '0', name: '实施'},
        {id: '1', name: '回收'},
        {id: '2', name: '更换'}
      ],
      provinceList: [], // 省
      prefectureList: [], // 市
      countyList: [], // 县
      adress01: {
        level: '2', // 层级（0国家,1省,2市,3区）
        parentId: '' // 父节点ID，查level=0时传2
      },
      adress02: {
        level: '3', // 层级（0国家,1省,2市,3区）
        parentId: '' // 父节点ID，查level=0时传2
      },
      detailInfo2: {}
    }
  },
  props: ['dlgInfo', 'detailInfo', 'info'],
  mounted () {
    this.getAreaId()
    this.detailInfo2 = JSON.parse(sessionStorage.getItem('detailInfo'))
    // this.createParams.mtNum = this.detailInfo2.boxChargeCount
  },
  methods: {
    // 派工类型联动
    typeSend (value) {
    /*   if (value === '1') {
        this.createParams.provinceId = this.detailInfo2.recoveryProvinceId
        this.getPrefecture(this.createParams.provinceId)
        setTimeout(() => {
          this.createParams.prefectureId = this.detailInfo2.recoveryCityId
          this.getCounty(this.createParams.prefectureId)
        }, 100)
        setTimeout(() => {
          this.createParams.countyId = this.detailInfo2.recoveryCountyId
          this.createParams.address = this.detailInfo2.recoveryAddress
        }, 300)
      } else {
        this.createParams.provinceId = this.detailInfo2.installationProvinceId
        this.getPrefecture(this.createParams.provinceId)
        setTimeout(() => {
          this.createParams.prefectureId = this.detailInfo2.installationCityId
          this.getCounty(this.createParams.prefectureId)
        }, 100)
        setTimeout(() => {
          this.createParams.countyId = this.detailInfo2.installationCountyId
          this.createParams.address = this.detailInfo2.installationAddress
        }, 300)
      } */
    },
    // 获取市
    getPrefecture (value) {
      if (value) {
        this.adress01.parentId = String(value)
        this.$store.dispatch('a:contract/getAreaId02', this.adress01).then(
          res => {
            this.prefectureList = res.data || []
          },
          rej => {
            this.alert(rej.errorInfo, 'error')
          }
        )
      } else {
        this.prefectureList = []
        this.createParams.prefectureId = ''
        this.createParams.countyId = ''
      }
    },
    // 获取县
    getCounty (value) {
      if (value) {
        this.adress02.parentId = String(value)
        this.$store.dispatch('a:contract/getAreaId03', this.adress02).then(
          res => {
            this.countyList = res.data || []
          },
          rej => {
            this.alert(rej.errorInfo, 'error')
          }
        )
      } else {
        this.countyList = []
        this.createParams.countyId = ''
      }
    },
    // 获取派工地址
    getAreaId () {
      this.$store.dispatch('a:contract/getAreaId01', this.adress).then(
        res => {
          this.provinceList = res.data || []
        },
        rej => {
          this.alert(rej.errorInfo, 'error')
        }
      )
    },
    // 创建派工单
    save () {
      if (!this.createParams.contact) {
        this.alert('请输入联系人！', 'error')
        return
      } else if (!this.createParams.contactPhone) {
        this.alert('请输入联系电话！', 'error')
        return
      } else if (!tool.isMobilePhone(this.createParams.contactPhone)) {
        this.alert('请输入正确的手机号码格式！', 'error')
        return
      } else if (!this.createParams.sendType) {
        this.alert('派工类型不能为空！', 'error')
        return
      } else if (!this.createParams.provinceId) {
        this.alert('省不能为空！', 'error')
        return
      } else if (!this.createParams.prefectureId) {
        this.alert('市不能为空！', 'error')
        return
      } else if (!this.createParams.countyId) {
        this.alert('县不能为空！', 'error')
        return
      } else if (!this.createParams.address) {
        this.alert('地址不能为空！', 'error')
        return
      } else if (!this.createParams.mtNum) {
        this.alert('设备数量不能为空！', 'error')
        return
      } else if (!this.createParams.description) {
        this.alert('描述不能为空！', 'error')
        return
      }
      // this.createParams.provinceId = String(this.createParams.provinceId)
      // this.createParams.prefectureId = String(this.createParams.prefectureId)
      // this.createParams.countyId = String(this.createParams.countyId)
      this.createParams.orderNo = this.info.agreementNo
      this.createParams.companyName = this.info.companyName
      // this.createParams.contact = this.info.customerServiceName
      // this.createParams.contactPhone = this.info.customerServiceTelephone
      this.createParams.nodeId = this.info.nodeId
      this.$store.dispatch('a:contract/createRequirement', this.createParams).then(
        res => {
          this.alert('创建派工需求单成功！', 'success')
          setTimeout(() => {
            this.dlgInfo.showDlg = false
          }, 100)
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
  .reset-wid {
    max-width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .require {
    color: red;
    margin-right: 3px;
    font-style: normal;
  }
  .description-wrap div {
    display: block;
    textarea {
      border-radius: 3px;
      resize: none;
      border: 1px solid #B2B2B2;
      outline: none;
      padding: 5px;
      margin-left: 5px;
    }
  }
  .description-wrap div:nth-of-type(1) {
    margin: 5px 5px;
  }
  .mall {
    width: 60px !important;
  }
  .leftLabe1 {
    margin-left: 22px !important;
  }
  .dialog-wrapper .dialog {
    min-width: 1020px;
  }
</style>
