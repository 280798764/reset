<template>
  <section class="nav-wrapper">
    <div>
      <ul v-for="(nav, i) in navList" :key="i">
        <li class="parent" @click="toggleSubNav(i,navList)">
          <i class="iconfont" :class="idToIcon[nav.moduleName]"></i>
          <span>{{nav.moduleName}}</span>
          <i class="iconfont" :class="nav.isOpen?'icon-less':'icon-moreunfold'" v-if="nav.isOpen" ></i>
          <i class="iconfont" :class="nav.isOpen?'icon-less':'icon-moreunfold'" v-if="!nav.isOpen"></i>
        </li>
        <li v-show="nav.isOpen" v-for="(subnav, index) in nav.pages" class="child" @click="clearFilterParams" :key="index">
          <router-link tag="div" :to="idToPath[subnav.url]">{{subnav.moduleName}}</router-link>
        </li>
      </ul>
     <!-- <div>
        <ul v-for="(nav, i) in navList" :key="i" @click="firstIndex">
          <router-link tag="div" :to="idToPath[nav.url]" class="parent"><span class="icon-reset iconfont"  :class="nav.icon"></span>{{nav.moduleName}}</router-link>
        </ul>
      </div>-->
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
const idToPath = {
  'parameter_manage': '/device/index', // "机床参数管理"
  'parameter_set': '/device/Efficiency', // "参数集管理"
  'message_manage': '/device/EfficiencyAbnormal', // "报文管理"
  'subscribe_manage': '/operations/factoryList', // "订阅管理"
  'message_query': '/operations/engineerList' // "报文查看"
}
const idToIcon = {
  '设备管理': 'icon-device',
  '运营管理': 'icon-huabanfuben',
  '权限管理': 'icon-quanxianguanli',
  '合同管理': 'icon-hetongguanli'
}
export default {
  data () {
    return {
      navList: [{
        isOpen: ''
      }
      ],
      idToIcon: idToIcon,
      idToPath: idToPath
    }
  },
  created () {
    this.$store.dispatch('a:login/getMenus', {
      appId: 'imeconfig',
      language: 'zh_CN',
      userId: ''
    }).then(
      res => {
        for (let i = 0; i < res.length; i++) {
          res[i].is0pen = false
        }
        this.navList = res
      },
      rej => {
        this.alert(rej.errorInfo, 'error')
      }
    )
  },
  methods: {
    // 展示隐藏子导航列表
    toggleSubNav (i, item) {
      this.firstIndex()
      item[i].isOpen = !item[i].isOpen
      Vue.set(this.navList, i, this.navList[i])
    },
    // 切换页面时currentIndex为空字符串
    firstIndex () {
      sessionStorage.setItem('backParams', JSON.stringify(''))
      sessionStorage.setItem('savePageStart', '')
    },
    // 清除index页面过滤参数
    clearFilterParams () {
      sessionStorage.removeItem('page')
      sessionStorage.removeItem('paramsFilter')
      // 移除之前默认选中的出库类别等信息（需求单模块）
      sessionStorage.removeItem('stockOutTypeIdTemp')
      sessionStorage.removeItem('stockOutTypeNameTemp')
      sessionStorage.removeItem('fromRequirePartInfo')
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/pages/side.less';
</style>
