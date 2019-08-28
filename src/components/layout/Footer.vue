<template>
  <section class="footer-wapper">
      <span>Copyright©{{endYear}} 智能云科信息科技有限公司 All Rights Reserved. 沪ICP备15045455号-1</span>
    </section>
</template>
<script>
export default {
  data () {
    return {
      endYear: new Date().getFullYear()
    }
  }
}
</script>
<style lang="less" scoped>
  @import "~@/assets/styles/modules/footer.less";
</style>
