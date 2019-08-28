<!-- 模糊查询 精确匹配名称 只能选择列表中的 -->
<!-- 客户名称之类的需要id的 -->
<template>
  <div class="matching-wrapper">
    <label v-if="showLabel" :class="{'required': required}" :style="{width: labelWidth}">{{title}}</label>
    <div class="select-wrapper" :style="{width: inputWidth}">
      <Select v-model="modelId"
        :label-in-value="true"
        @on-change="optionChanges"
        clearable
        filterable
        remote
        :label="name"
        :remote-method="remoteMethod"
        :loading="loading">
        <Option v-for="item in list" :value="item.value" :key="item.value">{{item.label}}</Option>
      </Select>
    </div>
  </div>
</template>

<script>
import tool from '@/utils/tool'

export default {
  data () {
    return {
      modelId: '',
      modelName: '',
      list: [],
      loading: false,
      applicationTypeCode: ''
    }
  },
  props: {
    id: { // 选项id
      type: [String, Number],
      default: ''
    },
    name: { // 选项名称，用于模糊查询
      type: String,
      default: ''
    },
    cmdId: { // 对应接口id
      type: Number,
      default: 0
    },
    title: { // label内容
      type: String,
      default: '标题'
    },
    required: { // 是否必填
      type: Boolean,
      default: false
    },
    labelWidth: { // label宽度
      type: String,
      default: '100px'
    },
    inputWidth: { // input宽度
      type: String,
      default: '120px'
    },
    hasEmitEvent: { // 是否有回调
      type: Boolean,
      default: false
    },
    emitOption: { // 将name和id都emit出去
      type: Boolean,
      default: false
    },
    limit: { // 查询返回个数
      type: Number,
      default: 10
    },
    // 请求的时候是否附上id，场景：当后台对列表进行过滤时，编辑的时候为了避免当前使用id被过滤
    needId: {
      type: Boolean,
      default: false
    },
    // 是否显示label
    showLabel: {
      type: Boolean,
      default: true
    }
  },
  created () {
    this.modelName = this.name
    this.modelId = this.id
    if (!this.id) this.remoteMethod()
  },
  methods: {
    // 远程检索
    remoteMethod (query) {
      this.loading = true
      let params = {
        name: query,
        limit: this.limit
      }
      if (this.needId) params.id = this.id
      this.$store.dispatch(tool.getCmdById(this.cmdId, 1), params).then(
        res => {
          this.loading = false
          this.list = []
          let listTemp = res || []
          for (let i in listTemp) {
            if (listTemp[i].id && listTemp[i].name) { // 过滤垃圾数据
              this.list.push({label: listTemp[i].name, value: listTemp[i].id})
            }
          }
        },
        rej => {
          this.list = []
          this.loading = false
          // console.error('模糊匹配异常！')
        }
      )
    },
    // 选项变化
    optionChanges (option) {
      if (option) {
        this.modelId = option.value
        if (option.label) this.modelName = option.label // 送修模块，matching带出matching-id组件id和name的场合，modelName被label置空了
        if (this.hasEmitEvent) {
          if (this.emitOption) {
            this.$emit('changeEvent', option)
          } else {
            this.$emit('changeEvent', this.modelId)
          }
        }
      }
      sessionStorage.setItem('factoryIdOption', JSON.stringify(option))
      console.log(option, 'option')
    },
    // 获取选中的id和name
    getSelectedOption () {
      return {
        id: this.modelId,
        name: this.modelName
      }
    },
    // 清除数据
    clearData () {
      this.modelId = ''
      this.modelName = ''
    }
  },
  watch: {
    id () {
      // console.log('matching id changes')
      this.modelId = this.id
      this.modelName = this.name
    },
    modelId () {
      this.remoteMethod()
      // id被清空时，name也要被清空
      if (!this.modelId) {
        this.modelName = ''
      }
    }
  }
}
</script>
