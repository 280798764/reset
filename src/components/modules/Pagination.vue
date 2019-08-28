<!-- 页面跳转 -->
<template>
  <section class="pagination-wrapper">
    <div class="left">
      <span>跳转至</span>
      <input type="text" v-model.trim="pageNo" v-on:blur="jumpTo" v-on:keyup.enter="jumpTo">
      <span>页</span>
    </div>
    <div class="right">
      <div class="page-info">
        <span class="prev-page iconfont pagination-arrow-left" :class="{disabled: !pageInfo.hasPrePage}" @click="gotoPrevPage" title="前一页"></span>
        <div class="pages-wrapper" @click="paginationAgent">
          <ul>
            <!-- 当前页码 之前列表 -->
            <template v-if="pageInfo.pageNo - 1 < 4">
              <li v-for="num in pageInfo.pageNo - 1" class="clickable" :key="num">{{num}}</li>
            </template>
            <template v-else>
              <li class="clickable">1</li>
              <li class="ellipsis">…</li>
              <li class="clickable">{{pageInfo.pageNo - 1}}</li>
            </template>
            <!-- 当前页码 -->
            <li class="active">{{pageInfo.pageNo}}</li>
            <!-- 当前页码 之后列表 -->
            <template v-if="pageInfo.totalPageCount - pageInfo.pageNo < 4">
              <li v-for="num in pageInfo.totalPageCount - pageInfo.pageNo" class="clickable" :key="pageInfo.pageNo + num">{{pageInfo.pageNo + num}}</li>
            </template>
            <template v-else>
              <li class="clickable">{{pageInfo.pageNo + 1}}</li>
              <li class="ellipsis">…</li>
              <li class="clickable">{{pageInfo.totalPageCount}}</li>
            </template>
          </ul>
        </div>
        <span class="next-page iconfont pagination-arrow-right" :class="{disabled: !pageInfo.hasNextPage}" @click="gotoNextPage" title="后一页"></span>
      </div>
      <div class="total-pages">
        <span>共</span>
        <span class="count">{{pageInfo.totalPageCount}}</span>
        <span>页</span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      pageNo: 1
    }
  },
  props: {
    pageInfo: Object
  },
  created () {
    this.pageNo = this.pageInfo.pageNo
  },
  methods: {
    // 跳页
    jumpTo () {
      this.pageNo = ~~this.pageNo
      if (this.pageNo >= 1 && this.pageNo <= this.pageInfo.totalPageCount) { // && this.pageNo !== this.pageInfo.pageNo
        this.$emit('pageChange', +this.pageNo)
      } else {
        this.clearNotice()
        this.alert('请输入正确的页码', 'info')
      }
    },
    // 页码列表 事件代理
    paginationAgent (e) {
      e.stopPropagation()
      if (e.target.className === 'clickable') {
        this.pageNo = +e.target.innerText
        this.$emit('pageChange', +e.target.innerText)
      }
    },
    // 切换至首页
    gotoFirstPage () {
      if (this.pageInfo.pageNo !== 1) this.$emit('pageChange', 1)
    },
    // 切换至尾页
    gotoLastPage () {
      if (this.pageInfo.pageNo !== this.pageInfo.totalPageCount) this.$emit('pageChange', this.pageInfo.totalPageCount)
    },
    // 切换至前一页
    gotoPrevPage () {
      if (this.pageInfo.pageNo > 1) this.$emit('pageChange', this.pageInfo.pageNo - 1)
    },
    // 切换至后一页
    gotoNextPage () {
      if (this.pageInfo.pageNo < this.pageInfo.totalPageCount) this.$emit('pageChange', this.pageInfo.pageNo + 1)
    }
  }
}
</script>

<style lang="less" scoped>
  @import "~@/assets/styles/modules/pagination.less";
</style>
