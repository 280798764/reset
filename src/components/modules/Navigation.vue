<template>
  <section class="nav-wrapper">
    <ul v-for="(nav, index) in dataNavList" :key="index">
      <li class="parent" @click="toggleNav(index)">
        <i class="iconfont" :class="nav.icon"></i>
        <span>{{nav.moduleName}}</span>
        <i class="iconfont" :class="nav.isOpen?'icon-less':'icon-moreunfold'" v-if="nav.isOpen" ></i>
        <i class="iconfont" :class="nav.isOpen?'icon-less':'icon-moreunfold'" v-if="!nav.isOpen"></i>
      </li>
      <li v-show="nav.isOpen" v-for="(subnav, subIndex) in nav.pages" class="child" :key="subIndex">
        <router-link tag="div" :to="idToPath[subnav.url]">{{subnav.pageName}}</router-link>
      </li>
    </ul>
  </section>
</template>

<script>
const idToPath = {
  'device/index': '/device/index', // 设备列表
  'ibox_factory_list': '/operations/factoryList', // 工厂管理
  'ibox_engineer_list': '/operations/engineerList' // 工程师管理
}
const idToIcon = {
  'db826dbf40c24ee8afb81c1f749b9bc1': 'icon-device',
  '1b9ce73003144f4dac8019e840c00f84': 'icon-huabanfuben'
}
export default {
  data () {
    return {
      dataNavList: this.navList,
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
        this.navList = res || []
        console.log(res, 'this.navList')
      },
      rej => {
        this.alert(rej.errorInfo, 'error')
      }
    )
  },
  methods: {
    toggleNav (index) {
      this.dataNavList.map((item, i) => {
        item.isOpen = index === i ? !item.isOpen : true
      })
      /* this.dataNavList.forEach((item, i) => {
        item.isOpen = index === i ? !item.isOpen : false
      }) */
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/modules/navigation.less';
  .icon-shebeiguanli {
    background: url('~@/assets/images/icons/device-icon.png');
  }
</style>
