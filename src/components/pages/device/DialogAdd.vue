<template>
  <section class="dialog-wrapper">
    <div class="dialog">
      <div class="dialog-header">
        <span>新增</span>
        <span class="dlg-close"><img src="~@/assets/images/close.png" @click="cancel"></span>
      </div>
      <div class="dialog-body">
        <div class="filter-wrapper">
          <div class="filter-line">
            <label class="app-name-dev special-first">参数ID</label><input type="text" v-model.trim="params.paramId">
            <label class="app-name-dev special-first">参数名称</label><input type="text" v-model.trim="params.paramName">
          </div>
          <div class="filter-line">
            <label>设备参数集</label>
            <div class="select-wrapper">
              <Select v-model="params.paramVersion" clearable>
                <Option v-for="item in equTypeList" :value="item.id" :key="item.id">{{item.type}}</Option>
              </Select>
            </div>
          </div>
          <div class="filter-line">
            <label class="app-name-dev special-first">设备参数集</label><input type="text" v-model.trim="params.paramId">
            <label class="app-name-dev special-first">参数类别
            </label><input type="text" v-model.trim="params.paramId">
          </div>
        </div>

      </div>
      <div class="dialog-footer">
        <div class="btn btn-cancel wid-70px mr-15px" @click="cancel">取消</div>
        <div class="btn btn-cancel wid-70px mr-15px" @click="cancel">确定</div>
      </div>
    </div>
  </section>
</template>

<script>
import mixinsTable from '@/utils/mixinsTable'
import mixinsInfo from '@/utils/mixinsInfo'

export default {
  mixins: [mixinsTable, mixinsInfo],
  data () {
    return {
      params: {
        paramId: '',
        paramName: ''
      },
      equTypeList: [] // 设备参数集
    }
  },
  props: ['dlgInfo', 'detailInfo', 'params2'],
  mounted () {
    this.getAll()
  },
  methods: {
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
    cancel () {
      this.dlgInfo.showDlg = false
    }
  }
}
</script>

<style lang="less" scoped>
  @import '~@/assets/styles/pages/device/DialogRelevance.less';
</style>
